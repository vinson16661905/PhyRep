# PhyRep Backend

FastAPI service that performs physics data processing (uncertainty calculations, regressions) and emits LaTeX report source strings for the frontend canvas.

## Features
- Successive difference uncertainty estimation
- Linear least-squares with slope/intercept uncertainties
- Logarithmic and general partial-derivative uncertainty propagation
- Templated LaTeX assembly with block-aware rendering

## Getting Started
1. **Install dependencies**
   ```bash
   cd backend
   pip install -e .
   ```

2. **Run the API**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

3. **Endpoints**
   - `GET /health` – readiness probe
   - `POST /generate-tex` – accepts a `ReportRequest` payload and returns raw `.tex` content

## Environment Variables
Use the following variables to tune behavior:
- `PHYREP_ALLOWED_ORIGINS` – comma separated list of origins for CORS (default `*`)
- `PHYREP_TEMPLATE_NAME` – override the template file name (default `report_template.tex`)

## Tests
Add tests under `backend/tests`. Run them with `pytest`.
