from __future__ import annotations

import asyncio
from dataclasses import dataclass

import httpx

from app.core.config import get_settings


@dataclass(slots=True)
class SummaryPayload:
    summary: str
    escalation_steps: str


class LLMService:
    def __init__(self) -> None:
        self.settings = get_settings()

    async def generate_summary(self, event_context: dict) -> SummaryPayload:
        ollama_response = await self._try_ollama(event_context)
        if ollama_response:
            return ollama_response
        gemini_response = await self._try_gemini(event_context)
        if gemini_response:
            return gemini_response
        return SummaryPayload(
            summary="Suspicious activity detected with no LLM fallback available.",
            escalation_steps="Review the clip, validate the detection, and notify security.",
        )

    async def _try_ollama(self, event_context: dict) -> SummaryPayload | None:
        prompt = self._prompt(event_context)
        url = f"{self.settings.ollama_base_url.rstrip('/')}/api/generate"
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    url,
                    json={"model": self.settings.ollama_model, "prompt": prompt, "stream": False},
                )
                response.raise_for_status()
                data = response.json()
                text = data.get("response", "").strip()
                if not text:
                    return None
                return self._parse_response(text)
        except Exception:
            return None

    async def _try_gemini(self, event_context: dict) -> SummaryPayload | None:
        if not self.settings.gemini_api_key:
            return None
        try:
            import google.generativeai as genai

            genai.configure(api_key=self.settings.gemini_api_key)
            model = genai.GenerativeModel(self.settings.gemini_model)
            response = await asyncio.to_thread(model.generate_content, self._prompt(event_context))
            text = getattr(response, "text", "") or ""
            return self._parse_response(text)
        except Exception:
            return None

    def _prompt(self, event_context: dict) -> str:
        return (
            "Summarize this security event in three short sections: scene summary, threat explanation, escalation steps. "
            "Use concise professional language. Event context: "
            f"{event_context}"
        )

    def _parse_response(self, text: str) -> SummaryPayload:
        lines = [line.strip("- ") for line in text.splitlines() if line.strip()]
        summary = lines[0] if lines else text.strip()
        escalation_steps = " ".join(lines[1:]) if len(lines) > 1 else "Escalate to on-duty security staff."
        return SummaryPayload(summary=summary, escalation_steps=escalation_steps)
