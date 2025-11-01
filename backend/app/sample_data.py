"""Sample datasets used by the dashboard view."""

from __future__ import annotations

from typing import Dict, List


def get_dashboard_data() -> Dict[str, List[dict]]:
    """Return hardcoded outbreak and vaccination data for demo purposes."""
    return {
        "outbreak_alerts": [
            {"district": "Delhi", "disease": "Dengue", "cases": 120},
            {"district": "Mumbai", "disease": "Malaria", "cases": 80},
            {"district": "Pune", "disease": "COVID-19", "cases": 250},
            {"district": "Chennai", "disease": "Dengue", "cases": 65},
        ],
        "vaccination_camps": [
            {"name": "Polio Drive - Phase 1", "area": "Rural Delhi", "date": "Nov 15, 2025"},
            {"name": "Measles-Rubella Camp", "area": "Mumbai (Dharavi)", "date": "Nov 18, 2025"},
            {"name": "Booster Dose Camp", "area": "Pune", "date": "Nov 20, 2025"},
        ],
    }
