import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCanvasStore } from "../../store/useCanvasStore";
export const TextBlockEditor = ({ block }) => {
    const updateBlock = useCanvasStore((state) => state.updateBlock);
    return (_jsxs("div", { children: [_jsxs("label", { children: ["\u5C0F\u8282\u6807\u9898", _jsx("input", { value: block.heading ?? "", onChange: (event) => updateBlock(block.id, { heading: event.target.value }) })] }), _jsxs("label", { children: ["\u6B63\u6587", _jsx("textarea", { value: block.content, onChange: (event) => updateBlock(block.id, { content: event.target.value }) })] })] }));
};
