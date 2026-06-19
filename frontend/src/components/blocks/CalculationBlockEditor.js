import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment } from "react";
import { useCanvasStore } from "../../store/useCanvasStore";
const methodOptions = [
    { value: "propagation", label: "偏导传递" },
    { value: "logarithmic", label: "对数法" },
];
const defaultPayload = {
    propagation: { expression: "", variables: [{ name: "x", value: 1, uncertainty: 0.01 }], units: "" },
    logarithmic: { result_value: 1, units: "", terms: [{ value: 1, uncertainty: 0 }] },
};
const cloneDefaultPayload = (method) => JSON.parse(JSON.stringify(defaultPayload[method]));
const parseNumberList = (value) => value
    .split(/[;,\s]+/)
    .map((token) => token.trim())
    .filter(Boolean)
    .map((token) => Number(token))
    .filter((num) => Number.isFinite(num));
const formatNumberList = (value) => (Array.isArray(value) ? value.join(", ") : "");
export const CalculationBlockEditor = ({ block }) => {
    const updateBlock = useCanvasStore((state) => state.updateBlock);
    const updatePayload = useCanvasStore((state) => state.updateBlockPayload);
    const payload = block.payload;
    const handlePayloadChange = (changes) => {
        updatePayload(block.id, changes);
    };
    const renderMethodFields = () => {
        switch (block.method) {
            case "propagation": {
                const variables = payload.variables ?? [];
                return (_jsxs(Fragment, { children: [_jsxs("label", { children: ["\u8868\u8FBE\u5F0F (Python / SymPy \u8BED\u6CD5)", _jsx("input", { value: payload.expression ?? "", onChange: (event) => handlePayloadChange({ expression: event.target.value }) })] }), _jsx("div", { className: "table-editor", children: _jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "\u540D\u79F0" }), _jsx("th", { children: "\u6570\u503C" }), _jsx("th", { children: "\u4E0D\u786E\u5B9A\u5EA6" }), _jsx("th", {})] }) }), _jsx("tbody", { children: variables.map((variable, index) => (_jsxs("tr", { children: [_jsx("td", { children: _jsx("input", { value: variable.name ?? "", onChange: (event) => {
                                                            const next = [...variables];
                                                            next[index] = { ...next[index], name: event.target.value };
                                                            handlePayloadChange({ variables: next });
                                                        } }) }), _jsx("td", { children: _jsx("input", { type: "number", step: "any", value: variable.value ?? 0, onChange: (event) => {
                                                            const next = [...variables];
                                                            next[index] = { ...next[index], value: Number(event.target.value) };
                                                            handlePayloadChange({ variables: next });
                                                        } }) }), _jsx("td", { children: _jsx("input", { type: "number", step: "any", value: variable.uncertainty ?? 0, onChange: (event) => {
                                                            const next = [...variables];
                                                            next[index] = { ...next[index], uncertainty: Number(event.target.value) };
                                                            handlePayloadChange({ variables: next });
                                                        } }) }), _jsx("td", { children: _jsx("button", { type: "button", className: "button secondary", onClick: () => handlePayloadChange({ variables: variables.filter((_, idx) => idx !== index) }), children: "\u5220\u9664" }) })] }, `${block.id}-var-${index}`))) })] }) }), _jsx("button", { type: "button", className: "button secondary", onClick: () => handlePayloadChange({ variables: [...variables, { name: "x", value: 0, uncertainty: 0 }] }), children: "+ \u6DFB\u52A0\u53D8\u91CF" }), _jsxs("label", { children: ["\u5355\u4F4D", _jsx("input", { value: payload.units ?? "", onChange: (event) => handlePayloadChange({ units: event.target.value }) })] })] }));
            }
            case "logarithmic": {
                const terms = payload.terms ?? [];
                return (_jsxs(Fragment, { children: [_jsxs("label", { children: ["\u7ED3\u679C\u6570\u503C", _jsx("input", { type: "number", step: "any", value: payload.result_value ?? 0, onChange: (event) => handlePayloadChange({ result_value: Number(event.target.value) }) })] }), _jsxs("label", { children: ["\u5355\u4F4D", _jsx("input", { value: payload.units ?? "", onChange: (event) => handlePayloadChange({ units: event.target.value }) })] }), _jsx("div", { className: "table-editor", children: _jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "\u91CF\u503C" }), _jsx("th", { children: "\u4E0D\u786E\u5B9A\u5EA6" }), _jsx("th", {})] }) }), _jsx("tbody", { children: terms.map((term, index) => (_jsxs("tr", { children: [_jsx("td", { children: _jsx("input", { type: "number", step: "any", value: term.value ?? 0, onChange: (event) => {
                                                            const next = [...terms];
                                                            next[index] = { ...next[index], value: Number(event.target.value) };
                                                            handlePayloadChange({ terms: next });
                                                        } }) }), _jsx("td", { children: _jsx("input", { type: "number", step: "any", value: term.uncertainty ?? 0, onChange: (event) => {
                                                            const next = [...terms];
                                                            next[index] = { ...next[index], uncertainty: Number(event.target.value) };
                                                            handlePayloadChange({ terms: next });
                                                        } }) }), _jsx("td", { children: _jsx("button", { type: "button", className: "button secondary", onClick: () => handlePayloadChange({ terms: terms.filter((_, idx) => idx !== index) }), children: "\u5220\u9664" }) })] }, `${block.id}-term-${index}`))) })] }) }), _jsx("button", { type: "button", className: "button secondary", onClick: () => handlePayloadChange({ terms: [...terms, { value: 1, uncertainty: 0 }] }), children: "+ \u6DFB\u52A0\u56E0\u5B50" })] }));
            }
            default:
                return null;
        }
    };
    return (_jsxs("div", { children: [_jsxs("label", { children: ["\u6A21\u5757\u6807\u9898", _jsx("input", { value: block.label, onChange: (event) => updateBlock(block.id, { label: event.target.value }) })] }), _jsxs("label", { children: ["\u8BA1\u7B97\u65B9\u6CD5", _jsx("select", { value: block.method, onChange: (event) => updateBlock(block.id, {
                            method: event.target.value,
                            payload: cloneDefaultPayload(event.target.value),
                        }), children: methodOptions.map((option) => (_jsx("option", { value: option.value, children: option.label }, option.value))) })] }), renderMethodFields(), _jsxs("label", { children: ["\u5907\u6CE8", _jsx("textarea", { value: block.notes ?? "", onChange: (event) => updateBlock(block.id, { notes: event.target.value }) })] })] }));
};
