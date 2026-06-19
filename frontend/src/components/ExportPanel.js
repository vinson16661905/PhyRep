import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useMutation } from "@tanstack/react-query";
import { requestTex } from "../services/api";
import { useCanvasStore } from "../store/useCanvasStore";
export const ExportPanel = () => {
    const meta = useCanvasStore((state) => state.meta);
    const blocks = useCanvasStore((state) => state.blocks);
    const mutation = useMutation({
        mutationFn: requestTex,
    });
    const handleGenerate = () => {
        mutation.mutate({ meta, blocks });
    };
    const handleCopy = async () => {
        if (!mutation.data?.tex)
            return;
        await navigator.clipboard.writeText(mutation.data.tex);
    };
    return (_jsxs("div", { className: "panel", children: [_jsx("h2", { children: "\u5BFC\u51FA" }), _jsx("button", { className: "button", onClick: handleGenerate, disabled: mutation.isPending, children: mutation.isPending ? "生成中..." : ".tex 源码" }), mutation.data?.tex && (_jsxs(_Fragment, { children: [_jsx("button", { className: "button secondary", onClick: handleCopy, style: { marginTop: "0.75rem" }, children: "\u590D\u5236\u5230\u526A\u8D34\u677F" }), _jsx("div", { className: "generated-tex", "aria-live": "polite", children: mutation.data.tex })] })), mutation.error && (_jsxs("p", { style: { color: "var(--danger)" }, children: ["\u751F\u6210\u5931\u8D25\uFF1A", mutation.error instanceof Error ? mutation.error.message : "未知错误"] }))] }));
};
