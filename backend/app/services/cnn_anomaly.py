from __future__ import annotations

from dataclasses import dataclass

import cv2
import numpy as np


@dataclass(slots=True)
class AnomalyResult:
    score: float
    heatmap: np.ndarray


class CNNAnomalyService:
    def __init__(self) -> None:
        self.previous_gray: np.ndarray | None = None

    def analyze(self, frame: np.ndarray) -> AnomalyResult:
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        gray = cv2.GaussianBlur(gray, (21, 21), 0)

        if self.previous_gray is None:
            self.previous_gray = gray
            return AnomalyResult(score=0.0, heatmap=np.zeros_like(frame))

        diff = cv2.absdiff(self.previous_gray, gray)
        threshold = cv2.threshold(diff, 24, 255, cv2.THRESH_BINARY)[1]
        dilated = cv2.dilate(threshold, None, iterations=2)
        score = float(np.clip(np.mean(dilated) / 255.0, 0.0, 1.0))
        heat = cv2.applyColorMap(cv2.normalize(diff, None, 0, 255, cv2.NORM_MINMAX), cv2.COLORMAP_JET)
        self.previous_gray = gray
        return AnomalyResult(score=score, heatmap=heat)
