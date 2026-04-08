from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.services.video_stream import StreamHub

router = APIRouter(tags=["stream"])


@router.websocket("/stream")
async def stream_socket(websocket: WebSocket):
    await websocket.accept()
    hub: StreamHub = websocket.app.state.stream_hub
    await hub.register(websocket)
    try:
        while True:
            try:
                await websocket.receive_text()
            except WebSocketDisconnect:
                break
    except WebSocketDisconnect:
        pass
    finally:
        await hub.unregister(websocket)
