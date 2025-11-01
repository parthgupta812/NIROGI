"""Smoke tests for the NIROGI Flask application."""

from __future__ import annotations

import pytest

from app import create_app


@pytest.fixture()
def app():
    """Create a Flask test instance."""
    app = create_app()
    app.config.update({"TESTING": True})
    return app


@pytest.fixture()
def client(app):
    """Return a Flask test client."""
    return app.test_client()


def test_healthcheck_returns_ok(client):
    """The healthcheck endpoint should confirm service availability."""
    response = client.get("/api/healthcheck")
    payload = response.get_json()

    assert response.status_code == 200
    assert payload["status"] == "ok"
    assert payload["service"] == "nirogi-backend"
