"""Utility helpers for language detection."""

from __future__ import annotations

import logging
from typing import Literal

from langdetect import DetectorFactory, LangDetectException, detect

DetectorFactory.seed = 0

_SUPPORTED_LANGS: set[str] = {"en", "hi"}
logger = logging.getLogger(__name__)


def detect_language(text: str) -> str:
    """Best-effort language detection for user input."""
    try:
        lang = detect(text)
    except LangDetectException:
        logger.debug("Language detection failed; defaulting to English.")
        return "en"
    return normalize_language_tag(lang)


def normalize_language_tag(tag: str) -> str:
    """Map loosely formatted tags onto the project's supported language set."""
    if not tag:
        return "en"

    tag_lower = tag.lower()
    if tag_lower.startswith("en"):
        return "en"
    if tag_lower.startswith("hi"):
        return "hi"

    logger.debug("Language '%s' not explicitly supported; defaulting to English.", tag)
    return "en"


def is_supported_language(tag: str) -> Literal[True]:
    """Return True when the language is supported.

    Raises
    ------
    ValueError
        If the language is not supported by the application.
    """
    normalized = normalize_language_tag(tag)
    if normalized not in _SUPPORTED_LANGS:
        raise ValueError(f"Language '{tag}' is not supported yet.")
    return True
