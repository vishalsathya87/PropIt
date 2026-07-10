import asyncio
from passlib.context import CryptContext
from database import db

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def create_admin():
    phone_number = "9999999999"
    password = "adminpassword"
    
    existing = await db.users.find_one({"phone_number": phone_number})
    if existing:
        print("Admin user already exists!")
        return
        
    admin_user = {
        "phone_number": phone_number,
        "password_hash": pwd_context.hash(password),
        "role": "ADMIN",
        "full_name": "System Administrator"
    }
    
    await db.users.insert_one(admin_user)
    print(f"Admin user created successfully!\nPhone: {phone_number}\nPassword: {password}")

if __name__ == "__main__":
    asyncio.run(create_admin())
