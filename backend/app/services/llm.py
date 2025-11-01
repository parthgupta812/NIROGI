"""Gemini client wrapper used to fetch health guidance."""

from __future__ import annotations

import logging
import os
from dataclasses import dataclass
from typing import Optional

logger = logging.getLogger(__name__)

try:  # pragma: no cover - runtime dependency import
    import google.generativeai as genai
except ImportError:  # pragma: no cover - handled gracefully in development
    genai = None  # type: ignore[assignment]


NIROGI_SYSTEM_PROMPT = (
    "You are Nirogi, a compassionate and factual health companion focused on preventive care for "
    "Indian rural and semi-urban communities. Provide clear, evidence-based guidance, include "
    "practical prevention tips, and encourage users to consult qualified medical professionals for "
    "diagnosis or emergency care. Always cite official health sources when referencing guidance. "
    "If you do not know an answer, admit it and encourage the user to consult a doctor."
    "\n\nOutbreak Tool: If the user asks for 'live cases', 'COVID stats', 'outbreak data', or 'today's COVID numbers', "
    "you must reply with only the exact text: @@FETCH_COVID_STATS@@ and nothing else."
    "\nHospital Tool: If the user asks for 'nearby hospitals', 'clinics near me', or 'doctors in my area', "
    "you must reply with only the exact text: @@FETCH_HOSPITALS@@ and nothing else."
)


class GeminiClientError(RuntimeError):
    """Wrap errors bubbled up from the Gemini SDK."""


@dataclass(slots=True)
class GeminiResponse:
    """Structured response from Gemini."""

    text: str
    metadata: dict[str, str]


def _compose_prompt(user_prompt: str, system_prompt: Optional[str]) -> str:
    if system_prompt:
        return f"{system_prompt.strip()}\n\nUser question: {user_prompt.strip()}"
    return user_prompt


def get_response(
    message: str,
    *,
    system_prompt: Optional[str] = None,
    api_key: Optional[str] = None,
    model_id: Optional[str] = None,
) -> str:
    """Return the Gemini response text for the supplied message."""
    if not message:
        raise GeminiClientError("Cannot generate a response for an empty prompt.")

    if genai is None:
        raise GeminiClientError("google-generativeai package is not installed.")

    resolved_api_key = api_key or os.getenv("GEMINI_API_KEY")
    if not resolved_api_key:
        raise GeminiClientError("GEMINI_API_KEY environment variable is not set.")

    resolved_model = model_id or os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    prompt = _compose_prompt(message, system_prompt or NIROGI_SYSTEM_PROMPT)

    try:
        genai.configure(api_key=resolved_api_key)
        model = genai.GenerativeModel(resolved_model)
        response = model.generate_content(prompt)
    except Exception as exc:  # noqa: BLE001 - surface SDK errors as-is
        raise GeminiClientError(str(exc)) from exc

    text = getattr(response, "text", None)
    if not text:
        raise GeminiClientError("Gemini response did not contain text content.")

    return text


class GeminiClient:
    """Lightweight Gemini API wrapper with sensible fallbacks."""

    def __init__(self, api_key: Optional[str], model: str) -> None:
        self.api_key = api_key
        self.model_id = model

        if not api_key and not os.getenv("GEMINI_API_KEY"):
            logger.warning("GEMINI_API_KEY is not set; responses will be mocked.")

    def generate_health_response(self, user_prompt: str, system_prompt: Optional[str] = None) -> GeminiResponse:
        """Generate a health-focused response from Gemini."""
        if not user_prompt:
            raise GeminiClientError("Cannot generate a response for an empty prompt.")

        effective_prompt = system_prompt or NIROGI_SYSTEM_PROMPT

        if not (self.api_key or os.getenv("GEMINI_API_KEY")):
            mocked_text = self._build_mock_response(user_prompt)
            return GeminiResponse(text=mocked_text, metadata={"provider": "mock"})

        text = get_response(
            user_prompt,
            system_prompt=effective_prompt,
            api_key=self.api_key,
            model_id=self.model_id,
        )
        return GeminiResponse(text=text, metadata={"provider": self.model_id})

    @staticmethod
    def _build_mock_response(user_prompt: str) -> str:
        """Return a deterministic mock response for local development."""
        return (
            "[Mocked Gemini Response] "
            "Update the GEMINI_API_KEY environment variable to enable live health guidance. "
            f"Echoing question: {user_prompt}"
        )
