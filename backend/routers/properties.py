from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from database import get_db
from models import PropertyCreate, PropertyInDB, PropertyResponse, PropertyUpdate
from .auth import get_current_user
from bson import ObjectId

router = APIRouter(prefix="/api/v1/properties", tags=["properties"])


def _doc_to_response(document) -> PropertyResponse:
    """Helper to convert a MongoDB document to a PropertyResponse."""
    return PropertyResponse(
        id=str(document["_id"]),
        seller_id=document["seller_id"],
        city=document["city"],
        district=document.get("district", ""),
        state=document.get("state", "Tamil Nadu"),
        area=document["area"],
        area_unit=document["area_unit"],
        price=document["price"],
        type=document["type"],
        keywords=document.get("keywords", []),
        description=document.get("description"),
        status=document["status"],
        view_count=document.get("view_count", 0),
        soil_type=document.get("soil_type"),
        water_source=document.get("water_source"),
        road_access=document.get("road_access"),
        fencing=document.get("fencing"),
        electricity=document.get("electricity", False),
        irrigation=document.get("irrigation", False),
        nearby_town=document.get("nearby_town"),
        distance_from_town_km=document.get("distance_from_town_km"),
    )


@router.get("/", response_model=List[PropertyResponse])
async def get_properties(
    type: Optional[str] = Query(None, description="Filter by land type"),
    city: Optional[str] = Query(None, description="Filter by city"),
    district: Optional[str] = Query(None, description="Filter by district"),
    min_area: Optional[float] = Query(None, description="Minimum area"),
    max_area: Optional[float] = Query(None, description="Maximum area"),
    min_price: Optional[float] = Query(None, description="Minimum price"),
    max_price: Optional[float] = Query(None, description="Maximum price"),
    water_source: Optional[str] = Query(None, description="Filter by water source"),
    road_access: Optional[str] = Query(None, description="Filter by road access"),
    soil_type: Optional[str] = Query(None, description="Filter by soil type"),
    electricity: Optional[bool] = Query(None, description="Filter by electricity"),
    irrigation: Optional[bool] = Query(None, description="Filter by irrigation"),
    search: Optional[str] = Query(None, description="Free text search"),
    db=Depends(get_db),
):
    query = {"status": "ACTIVE"}

    if type:
        query["type"] = type
    if city:
        query["city"] = {"$regex": city, "$options": "i"}
    if district:
        query["district"] = {"$regex": district, "$options": "i"}
    if min_area is not None or max_area is not None:
        query["area"] = {}
        if min_area is not None:
            query["area"]["$gte"] = min_area
        if max_area is not None:
            query["area"]["$lte"] = max_area
    if min_price is not None or max_price is not None:
        query["price"] = {}
        if min_price is not None:
            query["price"]["$gte"] = min_price
        if max_price is not None:
            query["price"]["$lte"] = max_price
    if water_source:
        query["water_source"] = water_source
    if road_access:
        query["road_access"] = road_access
    if soil_type:
        query["soil_type"] = soil_type
    if electricity is not None:
        query["electricity"] = electricity
    if irrigation is not None:
        query["irrigation"] = irrigation
    if search:
        query["$or"] = [
            {"city": {"$regex": search, "$options": "i"}},
            {"district": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"keywords": {"$elemMatch": {"$regex": search, "$options": "i"}}},
            {"nearby_town": {"$regex": search, "$options": "i"}},
        ]

    properties = []
    cursor = db.properties.find(query)
    async for document in cursor:
        properties.append(_doc_to_response(document))
    return properties


@router.post("/", response_model=PropertyResponse)
async def create_property(
    property_data: PropertyCreate,
    db=Depends(get_db),
    current_user=Depends(get_current_user),
):
    if current_user["role"] != "SELLER":
        raise HTTPException(status_code=403, detail="Only sellers can list properties")

    new_property = PropertyInDB(**property_data.dict(), seller_id=str(current_user["_id"]))
    # to_insert_dict() excludes _id: None so MongoDB auto-generates the ObjectId.
    result = await db.properties.insert_one(new_property.to_insert_dict())

    created_property = await db.properties.find_one({"_id": result.inserted_id})
    return _doc_to_response(created_property)


# IMPORTANT: /seller/me MUST be defined BEFORE /{property_id}
# otherwise FastAPI will interpret "seller" as a property_id path parameter.
@router.get("/seller/me", response_model=List[PropertyResponse])
async def get_my_properties(db=Depends(get_db), current_user=Depends(get_current_user)):
    if current_user["role"] != "SELLER":
        raise HTTPException(status_code=403, detail="Only sellers can view their listings here")

    properties = []
    cursor = db.properties.find({"seller_id": str(current_user["_id"])})
    async for document in cursor:
        properties.append(_doc_to_response(document))
    return properties


@router.get("/{property_id}", response_model=PropertyResponse)
async def get_property_by_id(property_id: str, db=Depends(get_db)):
    if not ObjectId.is_valid(property_id):
        raise HTTPException(status_code=400, detail="Invalid property ID")
    document = await db.properties.find_one({"_id": ObjectId(property_id)})
    if not document:
        raise HTTPException(status_code=404, detail="Property not found")
    # Increment view count atomically
    await db.properties.update_one(
        {"_id": ObjectId(property_id)},
        {"$inc": {"view_count": 1}},
    )
    document["view_count"] = document.get("view_count", 0) + 1
    return _doc_to_response(document)


@router.put("/{property_id}", response_model=PropertyResponse)
async def update_property(
    property_id: str,
    # Fix: use validated PropertyUpdate instead of raw dict to prevent
    # tampering with protected fields (seller_id, status, view_count, etc.)
    property_data: PropertyUpdate,
    db=Depends(get_db),
    current_user=Depends(get_current_user),
):
    if current_user["role"] not in ("SELLER", "ADMIN"):
        raise HTTPException(status_code=403, detail="Not authorized to edit")

    if not ObjectId.is_valid(property_id):
        raise HTTPException(status_code=400, detail="Invalid ID")

    existing = await db.properties.find_one({"_id": ObjectId(property_id)})
    if not existing:
        raise HTTPException(status_code=404, detail="Property not found")

    if existing["seller_id"] != str(current_user["_id"]) and current_user["role"] != "ADMIN":
        raise HTTPException(status_code=403, detail="Not your property")

    # Only push fields that were explicitly provided (exclude unset None values).
    update_fields = property_data.dict(exclude_none=True)
    if not update_fields:
        raise HTTPException(status_code=400, detail="No valid fields to update")

    await db.properties.update_one(
        {"_id": ObjectId(property_id)},
        {"$set": update_fields},
    )

    updated = await db.properties.find_one({"_id": ObjectId(property_id)})
    return _doc_to_response(updated)
