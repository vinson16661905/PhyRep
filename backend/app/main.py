"""FastAPI entrypoint for the PhyRep backend."""

from __future__ import annotations

import os
from pathlib import Path
from typing import List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .schemas import Block, ReportRequest, TexResponse, UncertaintyCalculationRequest, UncertaintyCalculationResponse
from .services.latex_renderer import LatexRenderer
from .services.processing import DataProcessingService


def _allowed_origins() -> List[str]:
    """Read comma-separated origins from the environment."""

    raw_value = os.getenv("PHYREP_ALLOWED_ORIGINS", "*")
    if raw_value.strip() == "*":
        return ["*"]
    return [origin.strip() for origin in raw_value.split(",") if origin.strip()]


app = FastAPI(title="PhyRep API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_processor = DataProcessingService()
_template_path = Path(__file__).parent / "templates"
_renderer = LatexRenderer(
    template_dir=_template_path,
    template_name=os.getenv("PHYREP_TEMPLATE_NAME", "report_template.tex"),
)


@app.get("/health")
def health() -> dict[str, str]:
    """Simple readiness endpoint."""

    return {"status": "ok"}


@app.post("/generate-tex", response_model=TexResponse)
def generate_tex(payload: ReportRequest) -> TexResponse:
    """Generate LaTeX source for the requested report."""

    try:
        processed_blocks = _processor.process_blocks(payload.blocks)
        tex_body = _renderer.render(meta=payload.meta, blocks=processed_blocks)
        return TexResponse(tex=tex_body)
    except ValueError as exc:  # pragma: no cover - FastAPI handles HTTP formatting
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.post("/calculate/uncertainty", response_model=UncertaintyCalculationResponse)
def calculate_uncertainty(request: UncertaintyCalculationRequest) -> UncertaintyCalculationResponse:
    """
    Perform a quick uncertainty propagation calculation.
    """
    payload = {
        "expression": request.expression,
        "variables": [v.model_dump() for v in request.variables],
        "units": ""
    }
    try:
        # Accessing the internal method directly for this helper endpoint
        result = _processor._propagate_uncertainty(payload)
        return UncertaintyCalculationResponse(
            result_value=result["result_value"],
            result_uncertainty=result["result_uncertainty"]
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


__all__ = ["app"]
