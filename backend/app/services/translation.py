"""Translation service abstraction layer."""

from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Optional

from googletrans import Translator

logger = logging.getLogger(__name__)

_translator = Translator()


class TranslationServiceError(RuntimeError):
    """Punt errors surfaced while translating content."""


@dataclass(slots=True)
class TranslationResult:
    """Container describing translation outcome."""

    text: str
    detected_language: str
    target_language: str


class TranslationService:
    """Translate text using the configured provider (googletrans by default)."""

    def __init__(self, provider: str, api_key: Optional[str] = None) -> None:
        self.provider = provider
        self.api_key = api_key

    def translate(self, text: str, target_language: str, source_language: Optional[str] = None) -> TranslationResult:
        """Translate text into the target language."""
        if not text:
            raise TranslationServiceError("Cannot translate empty text.")

        normalized_target = target_language.lower()
        normalized_source = (source_language or "").lower()

        if normalized_source and normalized_source == normalized_target:
            return TranslationResult(text=text, detected_language=normalized_source, target_language=normalized_target)

        try:
            translate_kwargs = {"dest": normalized_target}
            if normalized_source:
                translate_kwargs["src"] = normalized_source

            result = _translator.translate(text, **translate_kwargs)
        except Exception as exc:  # noqa: BLE001 - surface translation errors
            raise TranslationServiceError(str(exc)) from exc

        detected_language = (result.src or normalized_source or "en").lower()
        return TranslationResult(text=result.text, detected_language=detected_language, target_language=normalized_target)
