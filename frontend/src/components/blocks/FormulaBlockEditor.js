import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCanvasStore } from "../../store/useCanvasStore";
export const FormulaBlockEditor = ({ block }) => {
    const updateBlock = useCanvasStore((state) => state.updateBlock);
    return (_jsxs("div", { children: [_jsxs("label", { children: ["\u516C\u5F0F (LaTeX)", _jsx("textarea", { value: block.latex, onChange: (event) => updateBlock(block.id, { latex: event.target.value }) })] }), _jsxs("label", { children: ["\u8BF4\u660E", _jsx("input", { value: block.caption ?? "", onChange: (event) => updateBlock(block.id, { caption: event.target.value }) })] })] }));
};
