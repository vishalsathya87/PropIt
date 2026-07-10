from fastapi import APIRouter, Depends
from typing import List, Dict, Any
from database import get_db
from .auth import get_current_admin

# Removed dead imports: UserResponse, PropertyResponse (were imported but never used)

router = APIRouter(prefix="/api/v1/admin", tags=["admin"])


@router.get("/stats", response_model=Dict[str, Any])
async def get_platform_stats(db=Depends(get_db), current_admin=Depends(get_current_admin)):
    total_users = await db.users.count_documents({})
    total_properties = await db.properties.count_documents({})
    total_transactions = await db.transactions.count_documents({})

    # Aggregate total revenue from all successful transactions.
    revenue_pipeline = [
        {"$match": {"status": "SUCCESS"}},
        {"$group": {"_id": None, "total": {"$sum": "$amount"}}},
    ]
    revenue_result = await db.transactions.aggregate(revenue_pipeline).to_list(1)
    total_revenue = revenue_result[0]["total"] if revenue_result else 0

    return {
        "total_users": total_users,
        "total_properties": total_properties,
        "total_transactions": total_transactions,
        "total_revenue": total_revenue,
    }


@router.get("/users", response_model=List[Dict[str, Any]])
async def get_all_users(db=Depends(get_db), current_admin=Depends(get_current_admin)):
    users = []
    cursor = db.users.find({})
    async for document in cursor:
        users.append({
            "id": str(document["_id"]),
            "phone_number": document["phone_number"],
            "role": document["role"],
            "full_name": document.get("full_name"),
            "kyc_details": document.get("kyc_details"),
            "created_at": document.get("created_at"),
        })
    return users


@router.get("/properties", response_model=List[Dict[str, Any]])
async def get_all_properties(db=Depends(get_db), current_admin=Depends(get_current_admin)):
    properties = []
    cursor = db.properties.find({})
    async for document in cursor:
        properties.append({
            "id": str(document["_id"]),
            "seller_id": document["seller_id"],
            "city": document["city"],
            "status": document["status"],
            "view_count": document.get("view_count", 0),
            "created_at": document.get("created_at"),
        })
    return properties
