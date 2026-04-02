from fastapi import APIRouter, Depends, HTTPException, Query, Request

from app.services.db_service import DBService

router = APIRouter(prefix="/events", tags=["events"])


def get_db_service(request: Request) -> DBService:
    return request.app.state.db_service


@router.get("")
async def list_events(
    threat_level: str | None = Query(default=None),
    limit: int = Query(default=50, ge=1, le=200),
    db_service: DBService = Depends(get_db_service),
):
    return await db_service.list_events(threat_level=threat_level, limit=limit)


@router.get("/{event_id}")
async def get_event(event_id: str, db_service: DBService = Depends(get_db_service)):
    event = await db_service.get_event(event_id)
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return event
