# NIROGI - Multilingual AI Health Companion

NIROGI is a multilingual preventive healthcare assistant designed for rural and semi-urban communities. The platform combines a Flask backend, Gemini 1.5 Flash LLM, and translation services to deliver accurate, easy-to-understand medical guidance in English and Hindi.

## Project Status
- [x] Requirements captured
- [ ] Backend implemented
- [ ] Frontend implemented
- [ ] Health data integration completed
- [ ] Deployment configured

## Backend Quickstart
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment (recommended):
   ```bash
   python -m venv .venv
   .venv\Scripts\activate  # PowerShell
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy `.env.example` to `.env` and populate the required API keys.
5. Run the development server:
   ```bash
   python run.py
   ```

## Testing
Run the test suite from the `backend` folder:
```bash
pytest
```

## Environment Variables
| Variable | Description |
| --- | --- |
| `GEMINI_API_KEY` | Google AI Studio API key for Gemini 1.5 Flash |
| `GEMINI_MODEL` | Gemini model identifier |
| `TRANSLATION_PROVIDER` | Translation provider identifier (e.g., `google_translate`) |
| `TRANSLATION_API_KEY` | API key for the translation provider |
| `HEALTH_API_BASE_URL` | Base URL for health data integration |
| `CORS_ORIGINS` | Allowed origins for CORS |

## Next Steps
- Implement real translation via Google Translate or IndicTrans2.
- Integrate CoWIN, NDHM, and MoHFW data sources.
- Build the React-based frontend.
- Add automated deployment scripts for Render or Hugging Face Spaces.
