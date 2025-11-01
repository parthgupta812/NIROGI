"""Application factory for the NIROGI Flask backend."""

from __future__ import annotations

from pathlib import Path

from dotenv import load_dotenv
from flask import Flask, abort, send_from_directory
from flask_cors import CORS

from .config import Settings
from .routes import api_bp


load_dotenv()


def create_app(settings: Settings | None = None) -> Flask:
    """Configure and return a Flask app instance."""
    config = settings or Settings()

    frontend_root = Path(__file__).resolve().parents[2]
    app = Flask(__name__)
    app.config.update(config.to_flask_config())

    CORS(
        app,
        resources={r"/api/*": {"origins": config.cors_origins}},
        supports_credentials=True,
    )

    app.register_blueprint(api_bp, url_prefix="/api")

    @app.route("/")
    def index() -> str:
        """Serve the landing page for the integrated frontend."""
        return send_from_directory(frontend_root, "index.html")

    @app.route("/<path:filename>")
    def frontend_assets(filename: str):
        """Serve whitelisted frontend assets located at the project root."""
        allowed_files = {
            "index.html",
            "chat.html",
            "dashboard.html",
            "about.html",
            "style.css",
            "chat.js",
            "dashboard.js",
        }

        if filename in allowed_files:
            return send_from_directory(frontend_root, filename)

        abort(404)

    return app
