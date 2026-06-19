import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCanvasStore } from "../store/useCanvasStore";
const palette = [
    { type: "text", label: "文本", description: "描述、理论、结论等段落" },
    { type: "table", label: "数据表", description: "实验原始数据或处理表格" },
    { type: "formula", label: "公式", description: "LaTeX 公式展示" },
    { type: "image", label: "图像", description: "实验装置或图表" },
    { type: "calculation", label: "数据处理", description: "不确定度 / 拟合计算" },
];
export const BlockPalette = () => {
    const addBlock = useCanvasStore((state) => state.addBlock);
    return (_jsxs("div", { className: "panel palette", children: [_jsx("h2", { children: "\u6A21\u5757\u5E93" }), palette.map((item) => (_jsxs("button", { className: "button", onClick: () => addBlock(item.type), children: [_jsx("strong", { children: item.label }), _jsx("div", { style: { fontSize: "0.85rem", color: "var(--panel-text, #0a1c28)" }, children: item.description })] }, item.type)))] }));
};
