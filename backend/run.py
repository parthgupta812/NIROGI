"""Entrypoint for running the NIROGI Flask application."""

from __future__ import annotations

import os

from app import create_app


def main() -> None:
    """Create the Flask app and run the development server."""
    app = create_app()
    # Render sets PORT; fall back to Flask defaults when running locally.
    port = int(os.getenv("PORT", os.getenv("FLASK_RUN_PORT", "5000")))
    app.run(host="0.0.0.0", port=port, debug=app.config.get("DEBUG", False))


if __name__ == "__main__":
    main()

