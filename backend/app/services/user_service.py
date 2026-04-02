"""User profile management service"""
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId


class UserService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db

    async def ensure_indexes(self) -> None:
        """Create database indexes for users collection"""
        collection = self.db["users"]
        await collection.create_index("email", unique=True)
        await collection.create_index("camera_name")

    async def register_user(self, email: str, name: str, camera_name: str) -> dict | None:
        """Register or update a user profile"""
        collection = self.db["users"]
        user_data = {
            "email": email,
            "name": name,
            "camera_name": camera_name,
        }
        result = await collection.update_one(
            {"email": email},
            {"$set": user_data},
            upsert=True,
        )
        if result.upserted_id:
            return {"_id": str(result.upserted_id), **user_data}
        # Fetch the updated document
        user = await collection.find_one({"email": email})
        if user:
            user["_id"] = str(user["_id"])
        return user

    async def get_user_by_email(self, email: str) -> dict | None:
        """Retrieve user profile by email"""
        collection = self.db["users"]
        user = await collection.find_one({"email": email})
        if user:
            user["_id"] = str(user["_id"])
        return user

    async def get_user_by_id(self, user_id: str) -> dict | None:
        """Retrieve user profile by ID"""
        collection = self.db["users"]
        try:
            user = await collection.find_one({"_id": ObjectId(user_id)})
            if user:
                user["_id"] = str(user["_id"])
            return user
        except Exception:
            return None

    async def list_users(self) -> list[dict]:
        """List all registered users"""
        collection = self.db["users"]
        users = []
        async for user in collection.find():
            user["_id"] = str(user["_id"])
            users.append(user)
        return users

    async def delete_user(self, email: str) -> bool:
        """Delete a user profile"""
        collection = self.db["users"]
        result = await collection.delete_one({"email": email})
        return result.deleted_count > 0
