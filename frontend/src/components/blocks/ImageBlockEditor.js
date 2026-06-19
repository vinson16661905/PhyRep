import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCanvasStore } from "../../store/useCanvasStore";
export const ImageBlockEditor = ({ block }) => {
    const updateBlock = useCanvasStore((state) => state.updateBlock);
    return (_jsxs("div", { children: [_jsxs("label", { children: ["\u56FE\u7247\u8DEF\u5F84 / URL", _jsx("input", { value: block.url, onChange: (event) => updateBlock(block.id, { url: event.target.value }) })] }), _jsxs("label", { children: ["\u5BBD\u5EA6 (\u5355\u4F4D: LaTeX)", _jsx("input", { value: block.width ?? "", onChange: (event) => updateBlock(block.id, { width: event.target.value }) })] }), _jsxs("label", { children: ["\u56FE\u6CE8", _jsx("input", { value: block.caption ?? "", onChange: (event) => updateBlock(block.id, { caption: event.target.value }) })] })] }));
};
