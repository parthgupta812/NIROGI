"""Application factory for the NIROGI Flask backend."""

from __future__ import annotations

from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS

from .config import Settings
from .routes import api_bp


load_dotenv()


def create_app(settings: Settings | None = None) -> Flask:
    """Configure and return a Flask app instance."""
    config = settings or Settings()

    app = Flask(__name__)
    app.config.update(config.to_flask_config())

    CORS(
        app,
        resources={r"/api/*": {"origins": config.cors_origins}},
        supports_credentials=True,
    )

    app.register_blueprint(api_bp, url_prefix="/api")
    return app
