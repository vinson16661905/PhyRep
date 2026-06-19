import { useState } from "react";
import { createPortal } from "react-dom";
import { BlockPalette } from "./components/BlockPalette";
import { Canvas } from "./components/Canvas";
import { ExportPanel } from "./components/ExportPanel";
import { MetadataPanel } from "./components/MetadataPanel";
import { UncertaintyCalculator } from "./components/UncertaintyCalculator";

const App = () => {
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(true);
  console.log("App rendering, calculator open:", isCalculatorOpen);

  return (
    <>
      <div className="app-shell">
        <BlockPalette />
        <Canvas />
        <div className="panel-stack">
          <MetadataPanel />
          <ExportPanel />
        </div>
      </div>
      
      <UncertaintyCalculator isOpen={isCalculatorOpen} onClose={() => setIsCalculatorOpen(false)} />
      
      <button
        onClick={() => setIsCalculatorOpen(true)}
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          background: "#4df1c7",
          color: "#000",
          border: "2px solid #fff",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          fontSize: "30px",
          cursor: "pointer",
          boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 99999,
        }}
        title="Open Uncertainty Calculator"
      >
        ±
      </button>
    </>
  );
};

export default App;
