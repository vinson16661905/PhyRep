import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCanvasStore } from "../store/useCanvasStore";
const metaFields = [
    { key: "experiment", label: "实验名称" },
    { key: "student", label: "学生" },
    { key: "student_id", label: "学号" },
    { key: "date", label: "日期" },
];
export const MetadataPanel = () => {
    const meta = useCanvasStore((state) => state.meta);
    const setMeta = useCanvasStore((state) => state.setMeta);
    return (_jsxs("div", { className: "panel", children: [_jsx("h2", { children: "\u62A5\u544A\u5143\u6570\u636E" }), _jsx("div", { className: "metadata-grid", children: metaFields.map((field) => (_jsxs("label", { children: [field.label, field.multiline ? (_jsx("textarea", { value: meta[field.key] ?? "", onChange: (event) => setMeta({ [field.key]: event.target.value }) })) : (_jsx("input", { type: field.key === "date" ? "date" : "text", value: meta[field.key] ?? "", onChange: (event) => setMeta({ [field.key]: event.target.value }) }))] }, field.key))) })] }));
};
