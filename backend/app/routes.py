"""API routes for the NIROGI backend."""

from __future__ import annotations

import json
import logging
from http import HTTPStatus
from typing import Any, Dict, Optional

from flask import Blueprint, current_app, jsonify, request

from .sample_data import get_dashboard_data
from .services.health_data import HealthDataError, HealthDataService
from .services.llm import GeminiClient, GeminiClientError
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


@api_bp.get("/dashboard-data")
def dashboard_data() -> Any:
    """Provide sample data for the live dashboard UI."""
    return jsonify(get_dashboard_data())


@api_bp.post("/feedback")
def feedback() -> Any:
    """Accept user feedback submissions from the frontend."""
    payload: Dict[str, Any] = request.get_json(silent=True) or {}
    logger.info("FEEDBACK RECEIVED: %s", payload)
    return jsonify({"status": "ok"})


def chat_with_bot(
    message: str,
    language: str,
    translation_service: TranslationService,
    health_service: HealthDataService,
    llm_service: GeminiClient,
    context: Optional[str] = None,
) -> Dict[str, Any]:
    """Handle chat requests, manage tool invocations, and preserve context."""

    metadata: Dict[str, Any] = {"context": None}
    supplemental_data: Dict[str, Any] = {}
    normalized_language = language or "en"
    needs_translation = language == "hi"

    # --- STEP 1: Handle context-based follow ups ---
    if context == "awaiting_city_for_hospitals":
        city_name = message.strip()
        if not city_name:
            response_text = "Please share a valid city or district name so I can search for hospitals."
        else:
            if needs_translation:
                translation_result = translation_service.translate(city_name, target_language="en")
                city_name = translation_result.text.strip()

            hospitals = health_service.get_nearby_hospitals(city_name)
            if not hospitals:
                response_text = f"Sorry, I couldn't find any hospitals in {city_name}."
            else:
                prompt_string = (
                    f"Here is a list of hospitals in {city_name}: {json.dumps(hospitals, ensure_ascii=False)}. "
                    "Please format the top 3-4 results for the user, showing only the name and any available address information. "
                    "At the end, add the source: 'Source: OpenStreetMap API'"
                )
                summary = llm_service.get_response(prompt_string)
                response_text = summary.text.strip()
                metadata["llm"] = summary.metadata
                supplemental_data["hospitals"] = hospitals

        metadata["context"] = None
    elif context == "awaiting_disease_for_alert":
        disease_name = message.strip()
        if not disease_name:
            response_text = "Please tell me the disease name, for example Dengue or Malaria."
        else:
            if needs_translation:
                translation_result = translation_service.translate(disease_name, target_language="en")
                disease_name = translation_result.text.strip()

            alert_data = health_service.get_local_outbreak_alert(disease_name)
            if not alert_data:
                response_text = f"Sorry, I do not have any alerts for '{disease_name}' right now."
            else:
                prompt_string = (
                    f"Here is the alert data for {disease_name}: {json.dumps(alert_data, ensure_ascii=False)}. "
                    "Please summarize this for the user and include the 'advice' section. At the end, add the source: 'Source: National Health Portal (Simulated Data)'"
                )
                summary = llm_service.get_response(prompt_string)
                response_text = summary.text.strip()
                metadata["llm"] = summary.metadata
                supplemental_data["alert"] = alert_data

        metadata["context"] = None
    else:
        # --- STEP 2: Handle a new inbound message ---
        normalized_prompt = message.strip()
        if not normalized_prompt:
            return {"message": "message cannot be empty", "metadata": metadata}

        if language and language != "en":
            translation_result = translation_service.translate(normalized_prompt, target_language="en", source_language=language)
            normalized_prompt = translation_result.text
            normalized_language = translation_result.detected_language

        first_response = llm_service.get_response(normalized_prompt)
        response_text = first_response.text.strip()
        metadata["llm"] = first_response.metadata

        # --- STEP 3: Tool handling ---
        if response_text == "@@FETCH_COVID_STATS@@":
            state_data = health_service.get_statewise_covid_data()
            supplemental_data["statewise_covid"] = state_data
            prompt_string = (
                "Here is the live, state-wise COVID-19 data for all of India: "
                f"{json.dumps(state_data, ensure_ascii=False)}. Please summarize this data by grouping the states with active cases > 10. "
                "For each state, use a bullet point to list the **Active Cases** and **Cured (Recovered) Cases**. "
                "Use **bolding** for the state name. Do not use a markdown table. Finally, add a new line at the very bottom: 'Source: disease.sh API'"
            )
            second_response = llm_service.get_response(prompt_string)
            response_text = second_response.text.strip()
            metadata["llm"] = second_response.metadata
        elif response_text == "@@FETCH_HOSPITALS@@":
            response_text = "To find hospitals, I need to know your city or district name. Please tell me your city."
            metadata["context"] = "awaiting_city_for_hospitals"
        elif response_text == "@@FETCH_VACCINE_SCHEDULE@@":
            schedule = health_service.get_vaccine_schedule()
            supplemental_data["vaccine_schedule"] = schedule
            prompt_string = (
                "Here is the official vaccination schedule: "
                f"{json.dumps(schedule, ensure_ascii=False)}. Please format this nicely for the user, grouped by age."
            )
            second_response = llm_service.get_response(prompt_string)
            response_text = second_response.text.strip()
            metadata["llm"] = second_response.metadata
        elif response_text == "@@FETCH_DISEASE_OUTBREAK@@":
            response_text = "Which disease are you asking about? (e.g., Dengue, Malaria)"
            metadata["context"] = "awaiting_disease_for_alert"
        else:
            metadata["context"] = None

    # --- STEP 4: Translate back to the user's requested language ---
    if needs_translation:
        translated = translation_service.translate(response_text, target_language="hi")
        response_text = translated.text

    if supplemental_data:
        metadata["supplemental_data"] = supplemental_data

    return {
        "message": response_text,
        "metadata": metadata,
        "source_language": normalized_language,
        "language": language or normalized_language,
    }


@api_bp.post("/chat")
def chat() -> Any:
    """Primary chatbot endpoint handling multilingual health queries."""
    data: Dict[str, Any] = request.get_json(silent=True) or {}
    message = (data.get("message") or "").strip()
    if not message:
        return jsonify({"error": "message is required"}), HTTPStatus.BAD_REQUEST

    requested_language = (data.get("language") or "").strip().lower()
    context_token = (data.get("context") or None) or None

    language = requested_language

    try:
        if not language:
            language = detect_language(message)

        is_supported_language(language)
    except ValueError:
        invalid_lang = requested_language or language or "auto-detected"
        return (
            jsonify({"error": f"Language '{invalid_lang}' is not supported yet."}),
            HTTPStatus.BAD_REQUEST,
        )

    translation_service: TranslationService = current_app.extensions["translation_service"]
    health_service: HealthDataService = current_app.extensions["health_data_service"]
    llm_service: GeminiClient = current_app.extensions["gemini_client"]

    try:
        result = chat_with_bot(
            message=message,
            language=language,
            translation_service=translation_service,
            health_service=health_service,
            llm_service=llm_service,
            context=context_token,
        )
    except TranslationServiceError as exc:
        logger.exception("Translation failed.")
        return jsonify({"error": str(exc)}), HTTPStatus.INTERNAL_SERVER_ERROR
    except HealthDataError as exc:
        logger.exception("Health data retrieval failed.")
        return jsonify({"error": str(exc)}), HTTPStatus.BAD_GATEWAY
    except GeminiClientError as exc:
        logger.exception("Gemini request failed.")
        return jsonify({"error": str(exc)}), HTTPStatus.BAD_GATEWAY

    return jsonify(result)


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
