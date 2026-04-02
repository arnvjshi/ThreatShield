from fastapi import APIRouter

from app.api.routes.control import router as control_router
from app.api.routes.events import router as events_router
from app.api.routes.stream import router as stream_router
from app.api.routes.users import router as users_router

api_router = APIRouter()
api_router.include_router(control_router)
api_router.include_router(events_router)
api_router.include_router(stream_router)
api_router.include_router(users_router)
