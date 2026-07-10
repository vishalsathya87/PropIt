import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "propit")

# Connection pooling is configured here. serverSelectionTimeoutMS prevents
# the app from hanging indefinitely if MongoDB is unreachable at startup.
client = AsyncIOMotorClient(
    MONGODB_URL,
    maxPoolSize=10,
    minPoolSize=1,
    serverSelectionTimeoutMS=5000,
)
db = client[DATABASE_NAME]


def get_db():
    return db
