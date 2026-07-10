from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, handler=None):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema):
        field_schema.update(type="string")

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    phone_number: Optional[str] = None

class KYCDetails(BaseModel):
    aadhaar_number: str
    pan_number: str
    status: str = "PENDING"

class UserCreate(BaseModel):
    phone_number: str
    password: str
    role: str
    full_name: Optional[str] = None
    kyc_details: Optional[KYCDetails] = None

class UserInDB(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    phone_number: str
    password_hash: str
    role: str
    full_name: Optional[str] = None
    kyc_details: Optional[KYCDetails] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
class UserResponse(BaseModel):
    id: str
    phone_number: str
    role: str
    full_name: Optional[str] = None

# --- Property Models ---

class PropertyCreate(BaseModel):
    city: str
    district: str = ""
    state: str = "Tamil Nadu"
    area: float
    area_unit: str  # acres, sq_ft, cents, hectares
    price: float
    type: str  # Agricultural Land, Flat Plot, Farm Land, Residential Plot, Commercial Plot
    keywords: List[str] = []
    description: Optional[str] = None
    # Extra details for better search
    soil_type: Optional[str] = None  # Red, Black, Alluvial, Laterite
    water_source: Optional[str] = None  # Borewell, Canal, River, Rainfed, None
    road_access: Optional[str] = None  # National Highway, State Highway, Village Road, No Road
    fencing: Optional[str] = None  # Compound Wall, Wire Fence, Partial, None
    electricity: bool = False
    irrigation: bool = False
    nearby_town: Optional[str] = None
    distance_from_town_km: Optional[float] = None

class PropertyInDB(PropertyCreate):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    seller_id: str
    status: str = "ACTIVE"
    view_count: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)

class PropertyResponse(PropertyCreate):
    id: str
    seller_id: str
    status: str
    view_count: int
