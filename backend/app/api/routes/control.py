from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request

from app.schemas.event import ControlRequest, PipelineStatus
from app.services.video_stream import CameraPipeline

router = APIRouter(tags=["control"])


def get_pipeline(request: Request) -> CameraPipeline:
    return request.app.state.pipeline


@router.post("/start", response_model=PipelineStatus, responses={400: {"description": "Unable to start the selected camera source"}})
async def start_camera(payload: ControlRequest, pipeline: Annotated[CameraPipeline, Depends(get_pipeline)]):
    try:
        return await pipeline.start(payload.source, payload.owner_email, payload.camera_mode, payload.flash_url)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/stop", response_model=PipelineStatus)
async def stop_camera(pipeline: Annotated[CameraPipeline, Depends(get_pipeline)]):
    return await pipeline.stop()
