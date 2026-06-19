import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BlockPalette } from "./components/BlockPalette";
import { Canvas } from "./components/Canvas";
import { ExportPanel } from "./components/ExportPanel";
import { MetadataPanel } from "./components/MetadataPanel";
const App = () => (_jsxs("div", { className: "app-shell", children: [_jsx(BlockPalette, {}), _jsx(Canvas, {}), _jsxs("div", { className: "panel-stack", children: [_jsx(MetadataPanel, {}), _jsx(ExportPanel, {})] })] }));
export default App;
