"""Pydantic schemas for the PhyRep backend."""

from __future__ import annotations

from typing import Annotated, Dict, List, Literal, Optional, Union

from pydantic import BaseModel, Field


class ReportMeta(BaseModel):
    """Metadata that populates the LaTeX preamble."""

    experiment: str
    student: str
    student_id: str
    date: str


class TextBlock(BaseModel):
    type: Literal["text"]
    heading: Optional[str] = None
    content: str


class TableAnalysis(BaseModel):
    type: Literal["successive_difference", "least_squares", "uncertainty_single_set"]
    label: Optional[str] = None
    params: Dict[str, object] = Field(default_factory=dict)


class TableBlock(BaseModel):
    type: Literal["table"]
    caption: Optional[str] = None
    headers: List[str]
    rows: List[List[Union[str, float, int]]]
    analysis: Optional[List[TableAnalysis]] = None


class ImageBlock(BaseModel):
    type: Literal["image"]
    caption: Optional[str] = None
    url: str
    width: Optional[str] = Field(
        default="0.85\\textwidth",
        description="Any LaTeX-compatible width value such as 0.5\\textwidth or 8cm.",
    )


class FormulaBlock(BaseModel):
    type: Literal["formula"]
    latex: str
    caption: Optional[str] = None


class CalculationBlock(BaseModel):
    type: Literal["calculation"]
    label: str
    method: Literal["propagation", "logarithmic"]
    payload: Dict[str, object] = Field(default_factory=dict)
    notes: Optional[str] = None


Block = Annotated[
    Union[TextBlock, TableBlock, ImageBlock, FormulaBlock, CalculationBlock],
    Field(discriminator="type"),
]


class ReportRequest(BaseModel):
    """Request body accepted by the /generate-tex endpoint."""

    meta: ReportMeta
    blocks: List[Block]


class TexResponse(BaseModel):
    """Response wrapper that carries the LaTeX source."""

    tex: str


class Variable(BaseModel):
    name: str
    value: float
    uncertainty: float


class UncertaintyCalculationRequest(BaseModel):
    expression: str
    variables: List[Variable]


class UncertaintyCalculationResponse(BaseModel):
    result_value: float
    result_uncertainty: float
