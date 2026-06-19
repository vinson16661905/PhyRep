"""Domain-specific data processing helpers for uncertainty analysis."""

from __future__ import annotations

import math
from typing import Any, Dict, List, Sequence

import numpy as np
from sympy import Symbol, diff, sympify
from sympy.core.sympify import SympifyError

from ..schemas import Block, CalculationBlock, TableBlock


class DataProcessingService:
    """Dispatches block-level calculations before LaTeX rendering."""

    def process_blocks(self, blocks: Sequence[Block]) -> List[Dict[str, Any]]:
        processed: List[Dict[str, Any]] = []
        for block in blocks:
            if isinstance(block, CalculationBlock):
                processed.append(self._process_calculation(block))
            elif isinstance(block, TableBlock):
                processed.append(self._process_table(block))
            else:
                processed.append(block.model_dump())
        return processed

    # ------------------------------------------------------------------
    # Calculation handlers
    # ------------------------------------------------------------------
    def _process_calculation(self, block: CalculationBlock) -> Dict[str, Any]:
        method = block.method
        if method == "propagation":
            result = self._propagate_uncertainty(block.payload)
        elif method == "logarithmic":
            result = self._logarithmic_uncertainty(block.payload)
        else:  # pragma: no cover - impossible due to Literal guard
            raise ValueError(f"Unsupported calculation method: {method}")

        result.update({
            "type": "calculation",
            "label": block.label,
            "method": method,
            "notes": block.notes,
        })
        return result

    def _process_table(self, block: TableBlock) -> Dict[str, Any]:
        data = block.model_dump()
        if not block.analysis:
            return data
        
        analysis_results = []
        for item in block.analysis:
            result = {}
            try:
                if item.type == "uncertainty_single_set":
                    col_idx = int(item.params.get("colIndex", 0))
                    values = self._extract_column(block.rows, col_idx)
                    payload = {
                        "values": values,
                        "tolerance": item.params.get("tolerance", 0.01),
                        "units": "" 
                    }
                    result = self._uncertainty_single_set(payload)
                elif item.type == "successive_difference":
                    col_idx = int(item.params.get("colIndex", 0))
                    values = self._extract_column(block.rows, col_idx)
                    payload = {
                        "values": values,
                        "interval": item.params.get("interval", 1),
                        "units": ""
                    }
                    result = self._successive_difference(payload)
                elif item.type == "least_squares":
                    x_idx = int(item.params.get("xColIndex", 0))
                    y_idx = int(item.params.get("yColIndex", 1))
                    x_vals = self._extract_column(block.rows, x_idx)
                    y_vals = self._extract_column(block.rows, y_idx)
                    payload = {
                        "x": x_vals,
                        "y": y_vals,
                        "target": "slope",
                        "units": ""
                    }
                    result = self._least_squares(payload)
            except Exception as e:
                result = {"error": str(e)}
            
            result["analysis_type"] = item.type
            analysis_results.append(result)
        
        data["analysis_results"] = analysis_results
        return data

    def _extract_column(self, rows: List[List[Any]], col_idx: int) -> List[float]:
        values = []
        for row in rows:
            if col_idx < len(row):
                val = row[col_idx]
                try:
                    values.append(float(val))
                except (ValueError, TypeError):
                    pass 
        return values

    def _successive_difference(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        values = self._to_float_array(payload.get("values"), "values")
        if values.size < 4 or values.size % 2 != 0:
            raise ValueError("Successive difference requires an even count >= 4")
        interval = float(payload.get("interval", 1.0))
        if interval <= 0:
            raise ValueError("interval must be positive")

        half = values.size // 2
        leading = values[:half]
        trailing = values[half:]
        delta = trailing.sum() - leading.sum()
        estimate = delta / (half * interval)

        paired = trailing - leading
        if paired.size < 2:
            raise ValueError("Not enough pairs to estimate uncertainty")
        sigma = float(np.std(paired, ddof=1))
        uncertainty = sigma / (math.sqrt(half) * interval)

        return {
            "result_value": float(estimate),
            "result_uncertainty": float(uncertainty),
            "units": payload.get("units"),
            "summary": "Successive difference result",
            "details": {
                "n_pairs": half,
                "interval": interval,
                "sigma_pairs": sigma,
            },
        }

    def _least_squares(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        x = self._to_float_array(payload.get("x"), "x")
        y = self._to_float_array(payload.get("y"), "y")
        if x.size != y.size:
            raise ValueError("x and y arrays must share the same length")
        if x.size < 3:
            raise ValueError("Least squares requires at least 3 points")

        target = str(payload.get("target", "slope"))
        unit_map = payload.get("units")

        # Normal equation solution
        A = np.vstack([x, np.ones_like(x)]).T
        slope, intercept = np.linalg.lstsq(A, y, rcond=None)[0]

        fitted = slope * x + intercept
        residuals = y - fitted
        sy = math.sqrt(float(np.sum(residuals ** 2) / (x.size - 2)))
        delta = float(x.size * np.sum(x ** 2) - np.sum(x) ** 2)
        slope_unc = sy * math.sqrt(x.size / delta)
        intercept_unc = sy * math.sqrt(np.sum(x ** 2) / delta)
        r_squared = 1.0 - (np.sum(residuals ** 2) / np.sum((y - np.mean(y)) ** 2))

        target_value = slope if target == "slope" else intercept
        target_unc = slope_unc if target == "slope" else intercept_unc

        resolved_unit: str | None
        if isinstance(unit_map, dict):
            resolved_unit = unit_map.get(target)
        else:
            resolved_unit = unit_map

        return {
            "result_value": float(target_value),
            "result_uncertainty": float(target_unc),
            "units": resolved_unit,
            "summary": f"Least squares ({target})",
            "details": {
                "slope": float(slope),
                "slope_unc": float(slope_unc),
                "intercept": float(intercept),
                "intercept_unc": float(intercept_unc),
                "r_squared": float(r_squared),
            },
        }

    def _propagate_uncertainty(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        expression = payload.get("expression")
        variables = payload.get("variables")
        if not isinstance(expression, str) or not expression.strip():
            raise ValueError("propagation payload requires 'expression'")
        if not isinstance(variables, list) or not variables:
            raise ValueError("propagation payload requires a non-empty 'variables' list")

        symbols: Dict[str, Symbol] = {}
        substitutions: Dict[Symbol, float] = {}
        metadata: Dict[str, Dict[str, float]] = {}

        try:
            expr = sympify(expression, evaluate=True)
        except SympifyError as exc:  # pragma: no cover - user input
            raise ValueError(f"Could not parse expression: {expression}") from exc

        for entry in variables:
            try:
                name = str(entry["name"]).strip()
                value = float(entry["value"])
                uncert = float(entry["uncertainty"])
            except (KeyError, TypeError, ValueError) as exc:
                raise ValueError("Each variable must define name/value/uncertainty") from exc
            if not name:
                raise ValueError("Variable name cannot be empty")
            if uncert < 0:
                raise ValueError("Uncertainty must be non-negative")
            sym = symbols.setdefault(name, Symbol(name))
            substitutions[sym] = value
            metadata[name] = {"value": value, "uncertainty": uncert}

        variance = 0.0
        for name, sym in symbols.items():
            derivative = diff(expr, sym)
            sensitivity = float(derivative.subs(substitutions))
            variance += (sensitivity * metadata[name]["uncertainty"]) ** 2

        result_value = float(expr.subs(substitutions))
        result_unc = math.sqrt(variance)

        return {
            "result_value": result_value,
            "result_uncertainty": result_unc,
            "units": payload.get("units"),
            "summary": "General uncertainty propagation",
            "details": metadata,
        }

    def _logarithmic_uncertainty(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        terms = payload.get("terms")
        if not isinstance(terms, list) or not terms:
            raise ValueError("logarithmic method requires a 'terms' list")
        try:
            result_value = float(payload["result_value"])
        except (KeyError, TypeError, ValueError) as exc:
            raise ValueError("logarithmic payload requires 'result_value'") from exc

        rel_variance = 0.0
        for term in terms:
            try:
                value = float(term["value"])
                uncert = float(term["uncertainty"])
            except (KeyError, TypeError, ValueError) as exc:
                raise ValueError("Each term needs a numeric value and uncertainty") from exc
            if value == 0:
                raise ValueError("Term values must be non-zero for logarithmic rules")
            rel_variance += (uncert / value) ** 2

        relative_unc = math.sqrt(rel_variance)
        absolute_unc = abs(result_value) * relative_unc

        return {
            "result_value": result_value,
            "result_uncertainty": absolute_unc,
            "units": payload.get("units"),
            "summary": "Logarithmic uncertainty propagation",
            "details": {
                "relative_uncertainty": relative_unc,
                "terms": len(terms),
            },
        }

    def _uncertainty_single_set(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculate Type A, Type B, and combined uncertainty for a single set of data.
        """
        values = self._to_float_array(payload.get("values"), "values")
        tolerance = float(payload.get("tolerance", 0.0))
        units = payload.get("units", "")

        n = len(values)
        if n < 2:
            raise ValueError("Need at least 2 data points for uncertainty calculation")

        mean_val = np.mean(values)
        # Sample standard deviation (Bessel's correction, ddof=1)
        std_dev = np.std(values, ddof=1)
        
        # Type A uncertainty: S / sqrt(n)
        u_a = std_dev / math.sqrt(n)
        
        # Type B uncertainty: tolerance / sqrt(3)
        u_b = tolerance / math.sqrt(3)
        
        # Combined uncertainty
        u_combined = math.sqrt(u_a**2 + u_b**2)

        return {
            "mean": float(mean_val),
            "std_dev": float(std_dev),
            "n": int(n),
            "u_a": float(u_a),
            "u_b": float(u_b),
            "u_combined": float(u_combined),
            "tolerance": tolerance,
            "units": units,
            "values": values.tolist(),
        }

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------
    @staticmethod
    def _to_float_array(value: Any, field_name: str) -> np.ndarray:
        if value is None:
            raise ValueError(f"Missing required array '{field_name}'")
        try:
            array = np.asarray(value, dtype=float)
        except ValueError as exc:
            raise ValueError(f"Field '{field_name}' must be numeric") from exc
        if array.ndim != 1:
            raise ValueError(f"Field '{field_name}' must be one-dimensional")
        return array
