"""User management API routes"""
from fastapi import APIRouter, Depends, HTTPException, Request

from app.schemas.event import UserRegister, UserRead
from app.services.user_service import UserService


def get_user_service(request: Request) -> UserService:
    """Dependency injection for UserService"""
    return request.app.state.user_service


router = APIRouter(prefix="/users", tags=["users"])


@router.post("/register", response_model=UserRead)
async def register_user(
    user_data: UserRegister,
    user_service: UserService = Depends(get_user_service),
):
    """Register or update a user profile"""
    user = await user_service.register_user(
        email=user_data.email,
        name=user_data.name,
        camera_name=user_data.camera_name,
    )
    if not user:
        raise HTTPException(status_code=500, detail="Failed to register user")
    return user


@router.get("/email/{email}", response_model=UserRead)
async def get_user_by_email(
    email: str,
    user_service: UserService = Depends(get_user_service),
):
    """Get user profile by email"""
    user = await user_service.get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/{user_id}", response_model=UserRead)
async def get_user(
    user_id: str,
    user_service: UserService = Depends(get_user_service),
):
    """Get user profile by ID"""
    user = await user_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("", response_model=list[UserRead])
async def list_users(
    user_service: UserService = Depends(get_user_service),
):
    """List all registered users"""
    return await user_service.list_users()
