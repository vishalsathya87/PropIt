from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List
from database import get_db
from .auth import get_current_user
from .properties import _doc_to_response
from models import PropertyResponse
from bson import ObjectId

router = APIRouter(prefix="/api/v1/payments", tags=["payments"])

class UnlockRequest(BaseModel):
    property_id: str

@router.post("/mock-unlock")
async def mock_unlock_property(req: UnlockRequest, db = Depends(get_db), current_user = Depends(get_current_user)):
    if current_user["role"] != "BUYER":
        raise HTTPException(status_code=403, detail="Only buyers can unlock properties")
        
    property_id = req.property_id
    if not ObjectId.is_valid(property_id):
        raise HTTPException(status_code=400, detail="Invalid property ID")
        
    # Check if already unlocked
    existing = await db.transactions.find_one({
        "buyer_id": str(current_user["_id"]),
        "property_id": property_id
    })
    if existing:
        return {"message": "Already unlocked"}
        
    # Create transaction
    await db.transactions.insert_one({
        "buyer_id": str(current_user["_id"]),
        "property_id": property_id,
        "amount": 500,
        "status": "SUCCESS"
    })
    
    return {"message": "Payment successful, property unlocked"}

@router.get("/unlocked-properties", response_model=List[PropertyResponse])
async def get_unlocked_properties(db = Depends(get_db), current_user = Depends(get_current_user)):
    if current_user["role"] != "BUYER":
        raise HTTPException(status_code=403, detail="Only buyers can view unlocked properties")
        
    # Find all transactions for this buyer
    transactions = db.transactions.find({"buyer_id": str(current_user["_id"])})
    property_ids = []
    async for tx in transactions:
        property_ids.append(ObjectId(tx["property_id"]))
        
    # Fetch those properties
    properties = []
    if property_ids:
        cursor = db.properties.find({"_id": {"$in": property_ids}})
        async for document in cursor:
            properties.append(_doc_to_response(document))
    return properties
