import { useState } from "react";
import { createPortal } from "react-dom";
import { Rnd } from "react-rnd";
import { calculateUncertainty, Variable } from "../services/api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const UncertaintyCalculator = ({ isOpen, onClose }: Props) => {
  const [variables, setVariables] = useState<Variable[]>([
    { name: "x", value: 10, uncertainty: 0.1 },
    { name: "y", value: 5, uncertainty: 0.2 },
  ]);
  const [expression, setExpression] = useState("x * y");
  const [result, setResult] = useState<{ value: number; uncertainty: number } | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [size, setSize] = useState({ width: 400, height: 500 });
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [prevSize, setPrevSize] = useState({ width: 400, height: 500 });

  const handleCalculate = async () => {
    try {
      setError(null);
      const res = await calculateUncertainty({ expression, variables });
      setResult(res);
    } catch (err: any) {
      setError(err.message || "Calculation failed");
    }
  };

  const addVariable = () => {
    setVariables([...variables, { name: "", value: 0, uncertainty: 0 }]);
  };

  const removeVariable = (index: number) => {
    setVariables(variables.filter((_, i) => i !== index));
  };

  const updateVariable = (index: number, field: keyof Variable, value: string | number) => {
    const newVars = [...variables];
    const v = newVars[index];
    if (field === "name") {
        v.name = value as string;
    } else if (field === "value" || field === "uncertainty") {
        // @ts-ignore - we know field matches the type of value here based on usage
        v[field] = value as number;
    }
    setVariables(newVars);
  };

  const toggleMinimize = () => {
    if (isMinimized) {
      setSize(prevSize);
    } else {
      setPrevSize(size);
      setSize({ width: size.width, height: 50 });
    }
    setIsMinimized(!isMinimized);
  };

  if (!isOpen) return null;

  return createPortal(
    <Rnd
      size={size}
      position={position}
      onDragStop={(e: any, d: any) => setPosition({ x: d.x, y: d.y })}
      onResizeStop={(e: any, direction: any, ref: any, delta: any, position: any) => {
        setSize({
          width: parseInt(ref.style.width),
          height: parseInt(ref.style.height),
        });
        setPosition(position);
      }}
      minWidth={300}
      minHeight={50}
      bounds="window"
      dragHandleClassName="drag-handle"
      enableResizing={!isMinimized}
      style={{ zIndex: 99999, position: "fixed" }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "var(--panel-strong)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "12px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Header */}
        <div
          className="drag-handle"
          style={{
            padding: "10px 15px",
            background: "rgba(255,255,255,0.05)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "move",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            height: "50px",
            flexShrink: 0,
          }}
        >
          <span style={{ fontWeight: "bold", color: "var(--accent)" }}>Uncertainty Calculator</span>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={toggleMinimize}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--muted)",
                cursor: "pointer",
                fontSize: "1.2em",
                lineHeight: 1,
              }}
            >
              {isMinimized ? "□" : "_"}
            </button>
            <button
              onClick={onClose}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--danger)",
                cursor: "pointer",
                fontSize: "1.2em",
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Body */}
        {!isMinimized && (
          <div style={{ padding: "15px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
            {/* Variables */}
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label style={{ fontSize: "0.9em", color: "var(--muted)" }}>Variables</label>
                <button
                  onClick={addVariable}
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "none",
                    color: "var(--text)",
                    borderRadius: "4px",
                    padding: "2px 8px",
                    cursor: "pointer",
                    fontSize: "0.8em",
                  }}
                >
                  + Add
                </button>
              </div>
              {variables.map((v, i) => (
                <div key={i} style={{ display: "flex", gap: "5px" }}>
                  <input
                    placeholder="Name"
                    value={v.name}
                    onChange={(e) => updateVariable(i, "name", e.target.value)}
                    style={{ width: "60px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text)", borderRadius: "4px", padding: "4px" }}
                  />
                  <input
                    type="number"
                    placeholder="Value"
                    value={v.value}
                    onChange={(e) => updateVariable(i, "value", parseFloat(e.target.value))}
                    style={{ flex: 1, background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text)", borderRadius: "4px", padding: "4px" }}
                  />
                  <input
                    type="number"
                    placeholder="Unc"
                    value={v.uncertainty}
                    onChange={(e) => updateVariable(i, "uncertainty", parseFloat(e.target.value))}
                    style={{ flex: 1, background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text)", borderRadius: "4px", padding: "4px" }}
                  />
                  <button
                    onClick={() => removeVariable(i)}
                    style={{ background: "transparent", border: "none", color: "var(--danger)", cursor: "pointer" }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Expression */}
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label style={{ fontSize: "0.9em", color: "var(--muted)" }}>Expression</label>
              <input
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
                placeholder="e.g. x * y"
                style={{ width: "100%", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text)", borderRadius: "4px", padding: "8px" }}
              />
            </div>

            {/* Calculate Button */}
            <button
              onClick={handleCalculate}
              style={{
                background: "var(--accent)",
                color: "#000",
                border: "none",
                borderRadius: "6px",
                padding: "8px",
                fontWeight: "bold",
                cursor: "pointer",
                marginTop: "5px",
              }}
            >
              Calculate
            </button>

            {/* Result */}
            {error && <div style={{ color: "var(--danger)", fontSize: "0.9em" }}>{error}</div>}
            {result && (
              <div style={{ background: "rgba(255,255,255,0.05)", padding: "10px", borderRadius: "6px", marginTop: "5px" }}>
                <div style={{ fontSize: "0.8em", color: "var(--muted)" }}>Result</div>
                <div style={{ fontSize: "1.2em", fontWeight: "bold" }}>
                  {result.value.toPrecision(4)} ± {result.uncertainty.toPrecision(2)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Rnd>,
    document.body
  );
};
