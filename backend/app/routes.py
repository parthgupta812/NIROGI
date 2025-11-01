"""API routes for the NIROGI backend."""

from __future__ import annotations

import json
import logging
from http import HTTPStatus
from typing import Any, Dict

from flask import Blueprint, current_app, jsonify, request

from .services.health_data import HealthDataError, HealthDataService
from .services.llm import GeminiClient, GeminiClientError, NIROGI_SYSTEM_PROMPT
from .services.translation import TranslationService, TranslationServiceError
from .utils.language import detect_language, is_supported_language

logger = logging.getLogger(__name__)

api_bp = Blueprint("api", __name__)


@api_bp.record_once
def setup_state(state: Any) -> None:
    """Wire up service clients using the application configuration."""
    app = state.app
    app.logger.info("Configuring NIROGI services.")

    translation_provider = app.config.get("TRANSLATION_PROVIDER", "google_translate")
    translation_api_key = app.config.get("TRANSLATION_API_KEY")
    gemini_api_key = app.config.get("GEMINI_API_KEY")
    gemini_model = app.config.get("GEMINI_MODEL", "gemini-1.5-flash")
    health_base_url = app.config.get("HEALTH_API_BASE_URL")

    app.extensions["translation_service"] = TranslationService(translation_provider, translation_api_key)
    app.extensions["gemini_client"] = GeminiClient(gemini_api_key, gemini_model)
    app.extensions["health_data_service"] = HealthDataService(health_base_url)


@api_bp.get("/healthcheck")
def healthcheck() -> Any:
    """Simple uptime check for monitoring and deployment verification."""
    return jsonify({"status": "ok", "service": "nirogi-backend"})


@api_bp.post("/chat")
def chat() -> Any:
    """Primary chatbot endpoint handling multilingual health queries."""
    data: Dict[str, Any] = request.get_json(silent=True) or {}
    message = (data.get("message") or "").strip()
    if not message:
        return jsonify({"error": "message is required"}), HTTPStatus.BAD_REQUEST

    context_token = (data.get("context") or "").strip().lower()
    preferred_language = (data.get("language") or "").strip().lower()
    source_language = preferred_language or detect_language(message)

    try:
        is_supported_language(source_language)
    except ValueError:
        return (
            jsonify({"error": f"Language '{source_language}' is not supported yet."}),
            HTTPStatus.BAD_REQUEST,
        )

    try:
        is_supported_language(source_language)
    except ValueError:
        return (
            jsonify({"error": f"Language '{source_language}' is not supported yet."}),
            HTTPStatus.BAD_REQUEST,
        )

    translation_service: TranslationService = current_app.extensions["translation_service"]

    if context_token == "awaiting_city_for_hospitals":
        try:
            if source_language != "en":
                translation_result = translation_service.translate(
                    message,
                    target_language="en",
                    source_language=source_language,
                )
                city_prompt = translation_result.text.strip()
                normalized_language = translation_result.detected_language
            else:
                city_prompt = message
                normalized_language = source_language
        except TranslationServiceError as exc:
            logger.exception("Translation failed while processing hospital city context.")
            return jsonify({"error": str(exc)}), HTTPStatus.INTERNAL_SERVER_ERROR

        if not city_prompt:
            return jsonify({"error": "city name is required"}), HTTPStatus.BAD_REQUEST

        health_service: HealthDataService = current_app.extensions["health_data_service"]
        try:
            hospitals = health_service.get_nearby_hospitals(city_prompt)
        except HealthDataError as exc:
            logger.exception("Failed to fetch hospitals for %s", city_prompt)
            return jsonify({"error": str(exc)}), HTTPStatus.BAD_GATEWAY

        gemini_client: GeminiClient = current_app.extensions["gemini_client"]
        hospitals_payload = json.dumps(hospitals, ensure_ascii=False)
        follow_up_prompt = (
            f"Here is a list of hospitals in {city_prompt}: {hospitals_payload}. "
            "Please format the top 3-4 results for the user, showing only the name "
            "and any available address information."
        )

        try:
            llm_response = gemini_client.generate_health_response(follow_up_prompt, NIROGI_SYSTEM_PROMPT)
        except GeminiClientError as exc:
            logger.exception("Gemini request failed while summarising hospital list.")
            return jsonify({"error": str(exc)}), HTTPStatus.BAD_GATEWAY

        response_text = (llm_response.text or "").strip()

        try:
            if preferred_language and preferred_language != "en":
                translation_result = translation_service.translate(
                    response_text,
                    target_language=preferred_language,
                )
                response_text = translation_result.text
        except TranslationServiceError as exc:
            logger.warning("Failed to translate hospital response back to %s: %s", preferred_language, exc)

        payload = {
            "message": response_text,
            "source_language": normalized_language,
            "language": preferred_language or normalized_language,
            "metadata": {
                "llm": llm_response.metadata,
                "supplemental_data": {
                    "hospitals": hospitals,
                },
            },
        }
        return jsonify(payload)

    try:
        if source_language != "en":
            translation_result = translation_service.translate(message, target_language="en", source_language=source_language)
            normalized_prompt = translation_result.text
            normalized_language = translation_result.detected_language
        else:
            normalized_prompt = message
            normalized_language = source_language
    except TranslationServiceError as exc:
        logger.exception("Translation failed.")
        return jsonify({"error": str(exc)}), HTTPStatus.INTERNAL_SERVER_ERROR

    gemini_client: GeminiClient = current_app.extensions["gemini_client"]
    try:
        llm_response = gemini_client.generate_health_response(normalized_prompt, NIROGI_SYSTEM_PROMPT)
    except GeminiClientError as exc:
        logger.exception("Gemini request failed.")
        return jsonify({"error": str(exc)}), HTTPStatus.BAD_GATEWAY

    health_service: HealthDataService = current_app.extensions["health_data_service"]
    supplemental_data: Dict[str, Any] = {}

    response_text = (llm_response.text or "").strip()

    if response_text == "@@FETCH_COVID_STATS@@":
        try:
            state_data = health_service.get_statewise_covid_data()
        except HealthDataError as exc:
            logger.exception("State-wise COVID data fetch failed.")
            return jsonify({"error": str(exc)}), HTTPStatus.BAD_GATEWAY

        supplemental_data["statewise_covid"] = state_data
        stats_payload = json.dumps(state_data, ensure_ascii=False)
        follow_up_prompt = (
            "Here is the live, state-wise COVID-19 data for all of India: "
            f"{stats_payload}. Please summarize this for the user in a simple, "
            "empathetic table, showing the state, active cases, and cured."
        )

        try:
            llm_response = gemini_client.generate_health_response(follow_up_prompt, NIROGI_SYSTEM_PROMPT)
        except GeminiClientError as exc:
            logger.exception("Gemini follow-up request failed.")
            return jsonify({"error": str(exc)}), HTTPStatus.BAD_GATEWAY

        response_text = (llm_response.text or "").strip()
    elif response_text == "@@FETCH_HOSPITALS@@":
        follow_up_prompt = (
            "To find hospitals, I need to know your city or district name. Please tell me your city."
        )
        try:
            llm_response = gemini_client.generate_health_response(follow_up_prompt, NIROGI_SYSTEM_PROMPT)
        except GeminiClientError as exc:
            logger.exception("Gemini follow-up request failed while requesting city.")
            return jsonify({"error": str(exc)}), HTTPStatus.BAD_GATEWAY

        response_text = (llm_response.text or "").strip()
        supplemental_data["context"] = "awaiting_city_for_hospitals"
    else:
        try:
            supplemental_data = health_service.fetch_contextual_data(topic=normalized_prompt)
        except HealthDataError as exc:
            logger.warning("Health data fetch failed: %s", exc)
            supplemental_data = {"warning": "Health data unavailable"}

    try:
        if preferred_language and preferred_language != "en":
            translation_result = translation_service.translate(response_text, target_language=preferred_language)
            response_text = translation_result.text
    except TranslationServiceError as exc:
        logger.warning("Failed to translate response back to %s: %s", preferred_language, exc)

    payload = {
        "message": response_text,
        "source_language": normalized_language,
        "language": preferred_language or normalized_language,
        "metadata": {
            "llm": llm_response.metadata,
            "supplemental_data": supplemental_data,
        },
    }
    return jsonify(payload)


@api_bp.get("/test-hospitals")
def test_hospitals() -> Any:
    """Temporary route to fetch hospitals for a given city using Overpass."""
    city = (request.args.get("city") or "").strip()
    if not city:
        return jsonify({"error": "city query parameter is required"}), HTTPStatus.BAD_REQUEST

    health_service: HealthDataService = current_app.extensions["health_data_service"]
    try:
        hospitals = health_service.get_nearby_hospitals(city)
    except HealthDataError as exc:
        logger.exception("Failed to fetch hospitals for %s", city)
        return jsonify({"error": str(exc)}), HTTPStatus.BAD_GATEWAY

    return jsonify({"city": city, "hospitals": hospitals})


@api_bp.post("/translate")
def translate() -> Any:
    """Dedicated translation endpoint used by the frontend for UI text."""
    data: Dict[str, Any] = request.get_json(silent=True) or {}
    text = (data.get("text") or "").strip()
    target_language = (data.get("target_language") or "en").strip().lower()

    if not text:
        return jsonify({"error": "text is required"}), HTTPStatus.BAD_REQUEST

    translation_service: TranslationService = current_app.extensions["translation_service"]
    try:
        translation_result = translation_service.translate(text, target_language=target_language)
    except TranslationServiceError as exc:
        logger.exception("Translation failed.")
        return jsonify({"error": str(exc)}), HTTPStatus.INTERNAL_SERVER_ERROR

    return jsonify(
        {
            "text": translation_result.text,
            "detected_language": translation_result.detected_language,
            "target_language": translation_result.target_language,
        }
    )
