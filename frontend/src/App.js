import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { BlockPalette } from "./components/BlockPalette";
import { Canvas } from "./components/Canvas";
import { ExportPanel } from "./components/ExportPanel";
import { MetadataPanel } from "./components/MetadataPanel";
import { UncertaintyCalculator } from "./components/UncertaintyCalculator";
const App = () => {
    const [isCalculatorOpen, setIsCalculatorOpen] = useState(true);
    console.log("App rendering, calculator open:", isCalculatorOpen);
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "app-shell", children: [_jsx(BlockPalette, {}), _jsx(Canvas, {}), _jsxs("div", { className: "panel-stack", children: [_jsx(MetadataPanel, {}), _jsx(ExportPanel, {})] })] }), _jsx(UncertaintyCalculator, { isOpen: isCalculatorOpen, onClose: () => setIsCalculatorOpen(false) }), _jsx("button", { onClick: () => setIsCalculatorOpen(true), className: "calculator-launcher", style: {
                    position: "fixed",
                    bottom: "30px",
                    right: "30px",
                    background: "linear-gradient(120deg, var(--accent) 0%, var(--accent-strong) 100%)",
                    color: "#021018",
                    border: "1px solid rgba(255,255,255,0.35)",
                    borderRadius: "999px",
                    minWidth: "152px",
                    height: "52px",
                    padding: "0 1rem",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 99999,
                    letterSpacing: 0,
                    whiteSpace: "nowrap",
                }, title: "Open calculator", children: "Calc" })] }));
};
export default App;
