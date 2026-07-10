import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "propit")

client = AsyncIOMotorClient(MONGODB_URL)
db = client[DATABASE_NAME]

def get_db():
    return db
