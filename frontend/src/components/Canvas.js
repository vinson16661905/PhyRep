import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { DndContext, PointerSensor, useSensor, useSensors, } from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useCanvasStore } from "../store/useCanvasStore";
import { CalculationBlockEditor } from "./blocks/CalculationBlockEditor";
import { FormulaBlockEditor } from "./blocks/FormulaBlockEditor";
import { ImageBlockEditor } from "./blocks/ImageBlockEditor";
import { TableBlockEditor } from "./blocks/TableBlockEditor";
import { TextBlockEditor } from "./blocks/TextBlockEditor";
const BlockCard = ({ block }) => {
    const removeBlock = useCanvasStore((state) => state.removeBlock);
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: block.id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    const renderEditor = () => {
        switch (block.type) {
            case "text":
                return _jsx(TextBlockEditor, { block: block });
            case "table":
                return _jsx(TableBlockEditor, { block: block });
            case "formula":
                return _jsx(FormulaBlockEditor, { block: block });
            case "image":
                return _jsx(ImageBlockEditor, { block: block });
            case "calculation":
                return _jsx(CalculationBlockEditor, { block: block });
            default:
                return null;
        }
    };
    const blockTitleMap = {
        text: "文本",
        table: "表格",
        formula: "公式",
        image: "图像",
        calculation: "数据处理",
    };
    return (_jsxs("div", { className: "block-card", ref: setNodeRef, style: style, children: [_jsxs("header", { children: [_jsx("div", { ...attributes, ...listeners, style: { cursor: "grab" }, children: _jsxs("h4", { children: [blockTitleMap[block.type], " ", block.type === "text" && block.heading ? `｜${block.heading}` : ""] }) }), _jsx("button", { type: "button", className: "button secondary", onClick: () => removeBlock(block.id), children: "\u5220\u9664" })] }), renderEditor()] }));
};
export const Canvas = () => {
    const blocks = useCanvasStore((state) => state.blocks);
    const reorderBlocks = useCanvasStore((state) => state.reorderBlocks);
    const sensors = useSensors(useSensor(PointerSensor));
    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id)
            return;
        reorderBlocks(String(active.id), String(over.id));
    };
    return (_jsxs("div", { className: "panel canvas", children: [_jsx("h2", { children: "\u62A5\u544A\u753B\u5E03" }), _jsx(DndContext, { sensors: sensors, onDragEnd: handleDragEnd, children: _jsxs(SortableContext, { items: blocks.map((block) => block.id), children: [blocks.length === 0 && _jsx("p", { children: "\u5C06\u5DE6\u4FA7\u6A21\u5757\u62D6\u5165\u6B64\u5904\u5F00\u59CB\u6784\u5EFA\u5B9E\u9A8C\u62A5\u544A\u3002" }), blocks.map((block) => (_jsx(BlockCard, { block: block }, block.id)))] }) })] }));
};
