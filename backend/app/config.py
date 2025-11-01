"""Application configuration helpers."""

from __future__ import annotations

import os
from dataclasses import dataclass, field
from typing import Dict, Optional


@dataclass(slots=True)
class Settings:
    """Container for environment-driven configuration values."""

    gemini_api_key: Optional[str] = field(default_factory=lambda: os.getenv("GEMINI_API_KEY"))
    gemini_model: str = field(default_factory=lambda: os.getenv("GEMINI_MODEL", "gemini-1.5-flash"))
    translation_provider: str = field(default_factory=lambda: os.getenv("TRANSLATION_PROVIDER", "google_translate"))
    translation_api_key: Optional[str] = field(default_factory=lambda: os.getenv("TRANSLATION_API_KEY"))
    health_api_base_url: str = field(default_factory=lambda: os.getenv("HEALTH_API_BASE_URL", ""))
    cors_origins: str = field(default_factory=lambda: os.getenv("CORS_ORIGINS", "*"))
    debug: bool = field(default_factory=lambda: os.getenv("FLASK_DEBUG", "0") == "1")

    def to_flask_config(self) -> Dict[str, Optional[str]]:
        """Expose settings as Flask-compatible configuration values."""
        return {
            "GEMINI_API_KEY": self.gemini_api_key,
            "GEMINI_MODEL": self.gemini_model,
            "TRANSLATION_PROVIDER": self.translation_provider,
            "TRANSLATION_API_KEY": self.translation_api_key,
            "HEALTH_API_BASE_URL": self.health_api_base_url,
            "CORS_ORIGINS": self.cors_origins,
            "DEBUG": self.debug,
        }
