"""Health data integration stubs."""

from __future__ import annotations

import json
import logging
import os
from dataclasses import dataclass
from typing import Any, Dict, List, Optional

import requests

logger = logging.getLogger(__name__)


class HealthDataError(RuntimeError):
    """Raised when an upstream health API call fails."""


@dataclass(slots=True)
class HealthInsight:
    """Structured representation of supplemental health data."""

    summary: str
    source: str


DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../data"))


class HealthDataService:
    """Fetches health data from official sources such as CoWIN and MoHFW."""

    def __init__(self, base_url: str | None = None) -> None:
        self.base_url = base_url or ""

    def get_india_covid_stats(self) -> Dict[str, Any]:
        """Return national COVID-19 statistics for India."""
        try:
            response = requests.get("https://disease.sh/v3/covid-19/countries/India", timeout=5)
            response.raise_for_status()
        except requests.RequestException as exc:
            raise HealthDataError(str(exc)) from exc

        return response.json()

    def get_nearby_hospitals(self, city_name: str) -> List[Dict[str, Any]]:
        """Return a list of hospitals and clinics for the specified city using Overpass."""
        normalized_city = city_name.strip()
        if not normalized_city:
            raise HealthDataError("City name is required to fetch nearby hospitals.")

        overpass_url = "https://overpass-api.de/api/interpreter"
        escaped_city = normalized_city.replace('"', '\\"')
        query_string = f"""
[out:json][timeout:25];
area["name"~"^{escaped_city}$", i]->.searchArea;
(
    node["amenity"="hospital"](area.searchArea);
    way["amenity"="hospital"](area.searchArea);
    relation["amenity"="hospital"](area.searchArea);

    node["amenity"="clinic"](area.searchArea);
    way["amenity"="clinic"](area.searchArea);
    relation["amenity"="clinic"](area.searchArea);
);
out center;
"""

        try:
            response = requests.post(overpass_url, data={"data": query_string}, timeout=15)
            response.raise_for_status()
            payload = response.json()
        except requests.RequestException as exc:
            logger.warning("Overpass request failed for %s: %s", normalized_city, exc)
            fallback = self.get_local_hospital_fallback(normalized_city)
            if fallback:
                return fallback
            raise HealthDataError("Hospital lookup timed out. Please try again shortly.") from exc
        except ValueError as exc:
            logger.warning("Overpass response parsing failed for %s: %s", normalized_city, exc)
            fallback = self.get_local_hospital_fallback(normalized_city)
            if fallback:
                return fallback
            raise HealthDataError("Received an unexpected response while fetching hospitals.") from exc

        elements = payload.get("elements", [])
        if not isinstance(elements, list) or not elements:
            fallback = self.get_local_hospital_fallback(normalized_city)
            if fallback:
                return fallback
            raise HealthDataError("No hospitals were found for the requested city.")

        return elements

    def get_statewise_covid_data(self) -> List[Dict[str, Any]]:
        """Return live state-wise COVID-19 statistics for India."""
        url = "https://disease.sh/v3/covid-19/gov/India"
        try:
            response = requests.get(url, timeout=8)
            response.raise_for_status()
            payload = response.json()
        except requests.RequestException as exc:
            raise HealthDataError(str(exc)) from exc
        except ValueError as exc:
            raise HealthDataError("Failed to parse state-wise COVID data.") from exc

        states = payload.get("states")
        if not isinstance(states, list):
            raise HealthDataError("Unexpected response structure for state-wise data.")

        return states

    def get_vaccine_schedule(self) -> Dict[str, Any]:
        """Expose the local vaccine schedule via the service instance."""
        return get_vaccine_schedule()

    def get_local_outbreak_alert(self, disease_name: str) -> Optional[Dict[str, Any]]:
        """Expose the local outbreak alert lookup via the service instance."""
        return get_local_outbreak_alert(disease_name)

    def get_local_hospital_fallback(self, city_name: str) -> Optional[List[Dict[str, Any]]]:
        """Expose local hospital fallback data via the service instance."""
        return get_local_hospital_fallback(city_name)

    def fetch_contextual_data(self, topic: str, region: str | None = None) -> Dict[str, str]:
        """Fetch data related to the supplied health topic.

        The initial scaffold returns an empty payload while documenting where API
        integration should be placed. Replace this logic with concrete calls to
        CoWIN, NDHM, or MoHFW once API keys and endpoints are finalized.
        """
        if not self.base_url:
            logger.info("Health data base URL not configured; skipping live fetch.")
            return {}

        try:
            response = requests.get(self.base_url, timeout=5)
            response.raise_for_status()
        except requests.RequestException as exc:
            raise HealthDataError(str(exc)) from exc

        # TODO: Parse API specific payloads.
        return {
            "raw": response.text,
            "topic": topic,
            "region": region or "unspecified",
        }


def _load_json_file(file_name: str) -> Any:
    file_path = os.path.join(DATA_DIR, file_name)
    if not os.path.exists(file_path):
        raise HealthDataError(f"Data file '{file_name}' is missing.")

    try:
        with open(file_path, "r", encoding="utf-8") as handle:
            return json.load(handle)
    except (OSError, json.JSONDecodeError) as exc:
        raise HealthDataError(f"Failed to load data from {file_name}.") from exc


def get_vaccine_schedule() -> Dict[str, Any]:
    """Return the locally stored vaccine schedule."""
    return _load_json_file("vaccine_schedules.json")


def get_local_outbreak_alert(disease_name: str) -> Optional[Dict[str, Any]]:
    """Return the locally stored outbreak alert for the given disease."""
    if not disease_name:
        return None

    payload = _load_json_file("outbreak_alerts.json")
    alerts = payload.get("alerts", [])
    if not isinstance(alerts, list):
        return None

    lower_name = disease_name.strip().lower()
    for alert in alerts:
        if not isinstance(alert, dict):
            continue
        disease = str(alert.get("disease", "")).lower()
        if disease == lower_name:
            return alert

    return None


def get_local_hospital_fallback(city_name: str) -> Optional[List[Dict[str, Any]]]:
    """Return locally stored hospital data for the given city if available."""
    if not city_name:
        return None

    try:
        payload = _load_json_file("hospital_fallbacks.json")
    except HealthDataError:
        return None

    fallbacks = payload.get("fallbacks", {})
    if not isinstance(fallbacks, dict):
        return None

    return fallbacks.get(city_name.strip().lower())
