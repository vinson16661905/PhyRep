import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback } from "react";
import { useCanvasStore } from "../../store/useCanvasStore";
export const TableBlockEditor = ({ block }) => {
    const updateBlock = useCanvasStore((state) => state.updateBlock);
    const updateHeaders = (index, value) => {
        const headers = [...block.headers];
        headers[index] = value;
        updateBlock(block.id, { headers });
    };
    const updateCell = (rowIndex, colIndex, value) => {
        const rows = block.rows.map((row, idx) => idx === rowIndex ? row.map((cell, cIdx) => (cIdx === colIndex ? value : cell)) : row);
        updateBlock(block.id, { rows });
    };
    const addRow = useCallback(() => {
        const cols = block.headers.length || 1;
        updateBlock(block.id, { rows: [...block.rows, Array.from({ length: cols }, () => "")] });
    }, [block.headers.length, block.id, block.rows, updateBlock]);
    const addColumn = () => {
        const headers = [...block.headers, `列${block.headers.length + 1}`];
        const rows = block.rows.map((row) => [...row, ""]);
        updateBlock(block.id, { headers, rows });
    };
    const addAnalysis = () => {
        const newAnalysis = {
            type: "uncertainty_single_set",
            params: { colIndex: 0, tolerance: 0.01 },
        };
        updateBlock(block.id, { analysis: [...(block.analysis || []), newAnalysis] });
    };
    const removeAnalysis = (index) => {
        const newAnalysis = [...(block.analysis || [])];
        newAnalysis.splice(index, 1);
        updateBlock(block.id, { analysis: newAnalysis });
    };
    const updateAnalysis = (index, changes) => {
        const newAnalysis = [...(block.analysis || [])];
        newAnalysis[index] = { ...newAnalysis[index], ...changes };
        updateBlock(block.id, { analysis: newAnalysis });
    };
    const updateAnalysisParams = (index, params) => {
        const newAnalysis = [...(block.analysis || [])];
        newAnalysis[index] = { ...newAnalysis[index], params: { ...newAnalysis[index].params, ...params } };
        updateBlock(block.id, { analysis: newAnalysis });
    };
    return (_jsxs("div", { children: [_jsxs("label", { children: ["\u8868\u683C\u6807\u9898", _jsx("input", { value: block.caption ?? "", onChange: (event) => updateBlock(block.id, { caption: event.target.value }) })] }), _jsx("div", { className: "table-editor", children: _jsxs("table", { children: [_jsx("thead", { children: _jsx("tr", { children: block.headers.map((header, index) => (_jsx("th", { children: _jsx("input", { value: header, onChange: (event) => updateHeaders(index, event.target.value) }) }, index))) }) }), _jsx("tbody", { children: block.rows.map((row, rowIndex) => (_jsx("tr", { children: row.map((cell, colIndex) => (_jsx("td", { children: _jsx("input", { value: cell, onChange: (event) => updateCell(rowIndex, colIndex, event.target.value) }) }, `${rowIndex}-${colIndex}`))) }, `${block.id}-${rowIndex}`))) })] }) }), _jsxs("div", { className: "controls", children: [_jsx("button", { type: "button", className: "button secondary", onClick: addRow, children: "+ \u65B0\u589E\u4E00\u884C" }), _jsx("button", { type: "button", className: "button secondary", onClick: addColumn, children: "+ \u65B0\u589E\u4E00\u5217" })] }), _jsxs("div", { className: "analysis-section", children: [_jsx("h4", { children: "\u6570\u636E\u5206\u6790" }), (block.analysis || []).map((item, index) => (_jsxs("div", { className: "analysis-item", children: [_jsxs("div", { className: "analysis-header", children: [_jsxs("select", { value: item.type, onChange: (e) => updateAnalysis(index, { type: e.target.value }), children: [_jsx("option", { value: "uncertainty_single_set", children: "\u5355\u53D8\u91CF\u4E0D\u786E\u5B9A\u5EA6" }), _jsx("option", { value: "successive_difference", children: "\u9010\u5DEE\u6CD5" }), _jsx("option", { value: "least_squares", children: "\u6700\u5C0F\u4E8C\u4E58\u6CD5" })] }), _jsx("button", { type: "button", className: "button danger", onClick: () => removeAnalysis(index), children: "\u5220\u9664" })] }), _jsxs("div", { className: "analysis-body", children: [item.type === "uncertainty_single_set" && (_jsxs(_Fragment, { children: [_jsxs("label", { children: ["\u9009\u62E9\u5217", _jsx("select", { value: item.params.colIndex ?? 0, onChange: (e) => updateAnalysisParams(index, { colIndex: Number(e.target.value) }), children: block.headers.map((h, i) => _jsx("option", { value: i, children: h || `列 ${i + 1}` }, i)) })] }), _jsxs("label", { children: ["\u5141\u5DEE (e)", _jsx("input", { type: "number", step: "any", value: item.params.tolerance ?? 0.01, onChange: (e) => updateAnalysisParams(index, { tolerance: Number(e.target.value) }) })] })] })), item.type === "successive_difference" && (_jsxs(_Fragment, { children: [_jsxs("label", { children: ["\u9009\u62E9\u5217", _jsx("select", { value: item.params.colIndex ?? 0, onChange: (e) => updateAnalysisParams(index, { colIndex: Number(e.target.value) }), children: block.headers.map((h, i) => _jsx("option", { value: i, children: h || `列 ${i + 1}` }, i)) })] }), _jsxs("label", { children: ["\u6B65\u957F (Interval)", _jsx("input", { type: "number", value: item.params.interval ?? 1, onChange: (e) => updateAnalysisParams(index, { interval: Number(e.target.value) }) })] })] })), item.type === "least_squares" && (_jsxs(_Fragment, { children: [_jsxs("label", { children: ["X \u6570\u636E\u5217", _jsx("select", { value: item.params.xColIndex ?? 0, onChange: (e) => updateAnalysisParams(index, { xColIndex: Number(e.target.value) }), children: block.headers.map((h, i) => _jsx("option", { value: i, children: h || `列 ${i + 1}` }, i)) })] }), _jsxs("label", { children: ["Y \u6570\u636E\u5217", _jsx("select", { value: item.params.yColIndex ?? 1, onChange: (e) => updateAnalysisParams(index, { yColIndex: Number(e.target.value) }), children: block.headers.map((h, i) => _jsx("option", { value: i, children: h || `列 ${i + 1}` }, i)) })] })] }))] })] }, index))), _jsx("button", { type: "button", className: "button secondary", onClick: addAnalysis, children: "+ \u6DFB\u52A0\u5206\u6790" })] })] }));
};
