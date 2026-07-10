from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer
from typing import Optional
from database import get_db
from models import UserCreate, UserInDB, TokenData, UserResponse
from firebase_admin import auth

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


async def get_current_user(token: str = Depends(oauth2_scheme), db=Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Verify the Firebase ID token
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token.get("uid")
        email = decoded_token.get("email")
        if uid is None:
            raise credentials_exception
        token_data = TokenData(uid=uid, email=email)
    except Exception as e:
        # Token invalid, expired, or verification failed
        raise credentials_exception

    user = await db.users.find_one({"_id": token_data.uid})
    if user is None:
        raise credentials_exception
    return user


async def get_current_admin(current_user=Depends(get_current_user)):
    if current_user.get("role") != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required",
        )
    return current_user


@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate, db=Depends(get_db)):
    # Check if this UID is already registered in MongoDB
    existing_user_uid = await db.users.find_one({"_id": user.uid})
    if existing_user_uid:
        raise HTTPException(status_code=400, detail="User already registered in database")

    # Check if the phone number is already registered in MongoDB
    existing_user_phone = await db.users.find_one({"phone_number": user.phone_number})
    if existing_user_phone:
        raise HTTPException(status_code=400, detail="Phone number already registered")

    # Convert to UserInDB model
    user_dict = user.model_dump(by_alias=True)
    # Firebase uid maps to _id in MongoDB
    user_dict["_id"] = user_dict.pop("uid")

    new_user = UserInDB(**user_dict)
    # Insert into DB
    await db.users.insert_one(new_user.to_insert_dict())

    created_user = await db.users.find_one({"_id": new_user.id})
    if not created_user:
        raise HTTPException(status_code=500, detail="Failed to create user record")

    return UserResponse(
        id=str(created_user["_id"]),
        email=created_user["email"],
        phone_number=created_user["phone_number"],
        role=created_user["role"],
        full_name=created_user.get("full_name"),
    )


@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user=Depends(get_current_user)):
    return UserResponse(
        id=str(current_user["_id"]),
        email=current_user["email"],
        phone_number=current_user["phone_number"],
        role=current_user["role"],
        full_name=current_user.get("full_name"),
    )
