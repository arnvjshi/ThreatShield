from __future__ import annotations

import base64
from dataclasses import dataclass
from typing import Iterable

import cv2
import numpy as np

from app.schemas.event import BoundingBox


@dataclass(slots=True)
class FramePacket:
    frame: np.ndarray
    timestamp: float
    detections: list[BoundingBox]
    anomaly_score: float
    heatmap: np.ndarray | None = None


def encode_frame_to_jpeg(frame: np.ndarray) -> str:
    success, buffer = cv2.imencode(".jpg", frame)
    if not success:
        raise ValueError("Unable to encode frame")
    return base64.b64encode(buffer.tobytes()).decode("ascii")


def draw_detections(frame: np.ndarray, detections: Iterable[BoundingBox], anomaly_score: float) -> np.ndarray:
    output = frame.copy()
    for detection in detections:
        color = (80, 220, 180) if detection.label.lower() != "weapon" else (40, 80, 220)
        start = (int(detection.x1), int(detection.y1))
        end = (int(detection.x2), int(detection.y2))
        cv2.rectangle(output, start, end, color, 2)
        text = f"{detection.label} {detection.confidence:.2f}"
        cv2.putText(output, text, (start[0], max(24, start[1] - 10)), cv2.FONT_HERSHEY_SIMPLEX, 0.55, color, 2)

    status_text = f"Anomaly {anomaly_score:.2f}"
    cv2.putText(output, status_text, (24, 36), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (240, 240, 240), 2)
    return output
