"""Render LaTeX from block metadata using Jinja2 templates."""

from __future__ import annotations

from pathlib import Path
from typing import Any, Dict, Iterable, List

from jinja2 import Environment, FileSystemLoader, Template

from ..schemas import ReportMeta

_LATEX_SAFE_REPLACEMENTS = {
    "\\": r"\textbackslash{}",
    "&": r"\&",
    "%": r"\%",
    "$": r"\$",
    "#": r"\#",
    "_": r"\_",
    "{": r"\{",
    "}": r"\}",
    "~": r"\textasciitilde{}",
    "^": r"\textasciicircum{}",
}


def latex_escape(value: Any) -> str:
    """Best-effort LaTeX escaping for plain text content."""

    text = str(value)
    for char, replacement in _LATEX_SAFE_REPLACEMENTS.items():
        text = text.replace(char, replacement)
    return text


def latex_lines(value: Any) -> str:
    """Convert new lines to LaTeX line breaks."""

    return latex_escape(value).replace("\n", "\\\\\n")


class LatexRenderer:
    """Wraps the Jinja2 environment and template lookup."""

    def __init__(self, template_dir: Path, template_name: str = "report_template.tex") -> None:
        if not template_dir.exists():
            raise FileNotFoundError(f"Template directory not found: {template_dir}")
        loader = FileSystemLoader(str(template_dir))
        self._env = Environment(loader=loader, autoescape=False, trim_blocks=True, lstrip_blocks=True)
        self._env.filters["latex_escape"] = latex_escape
        self._env.filters["latex_lines"] = latex_lines
        self._template: Template = self._env.get_template(template_name)

    def render(self, meta: ReportMeta, blocks: Iterable[Dict[str, Any]]) -> str:
        """Render the LaTeX body using the current template."""

        meta_payload = meta.model_dump()
        block_payload = list(blocks)
        return self._template.render(meta=meta_payload, blocks=block_payload)
