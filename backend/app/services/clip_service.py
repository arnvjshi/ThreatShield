from __future__ import annotations

from collections import deque
from pathlib import Path
from typing import Iterable

import cv2
import numpy as np

from app.schemas.event import BoundingBox
from app.utils.vision import FramePacket


class ClipService:
    def __init__(self, output_dir: str, pre_event_seconds: int, post_event_seconds: int) -> None:
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.thumbnail_dir = self.output_dir.parent / "thumbnails"
        self.thumbnail_dir.mkdir(parents=True, exist_ok=True)
        self.pre_event_seconds = pre_event_seconds
        self.post_event_seconds = post_event_seconds

    def _open_writer(self, clip_path: Path, fps: int, width: int, height: int) -> cv2.VideoWriter | None:
        for codec in ("avc1", "H264", "mp4v"):
            writer = cv2.VideoWriter(str(clip_path), cv2.VideoWriter_fourcc(*codec), float(fps), (width, height))
            if writer.isOpened():
                return writer
            writer.release()
        return None

    def make_buffer(self, fps: int) -> deque[FramePacket]:
        maxlen = max(1, fps * self.pre_event_seconds)
        return deque(maxlen=maxlen)

    def save_clip(
        self,
        buffered_frames: Iterable[FramePacket],
        post_event_frames: Iterable[FramePacket],
        event_id: str,
        fps: int,
    ) -> str:
        frames = [*buffered_frames, *post_event_frames]
        if not frames:
            return ""

        height, width = frames[0].frame.shape[:2]
        clip_path = self.output_dir / f"{event_id}.mp4"
        writer = self._open_writer(clip_path, fps, width, height)
        if writer is None:
            return ""
        for packet in frames:
            writer.write(packet.frame)
        writer.release()
        return str(clip_path)

    def save_thumbnail(self, frames: Iterable[FramePacket], event_id: str) -> str:
        frame_list = list(frames)
        if not frame_list:
            return ""

        frame = frame_list[len(frame_list) // 2].frame
        thumbnail_path = self.thumbnail_dir / f"{event_id}.jpg"
        cv2.imwrite(str(thumbnail_path), frame)
        return str(thumbnail_path)
