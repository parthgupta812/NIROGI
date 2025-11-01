"""Entrypoint for running the NIROGI Flask application."""

from __future__ import annotations

import os

from app import create_app


def main() -> None:
    """Create the Flask app and run the development server."""
    app = create_app()
    host = os.getenv("FLASK_RUN_HOST", "127.0.0.1")
    port = int(os.getenv("FLASK_RUN_PORT", "5000"))
    app.run(host=host, port=port, debug=app.config.get("DEBUG", False))


if __name__ == "__main__":
    main()
