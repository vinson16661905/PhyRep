import { Fragment } from "react";

import { useCanvasStore } from "../../store/useCanvasStore";
import type { CalculationBlock, CalculationMethod } from "../../types/blocks";

interface Props {
  block: CalculationBlock;
}

const methodOptions: { value: CalculationMethod; label: string }[] = [
  { value: "propagation", label: "偏导传递" },
  { value: "logarithmic", label: "对数法" },
];

const defaultPayload: Record<CalculationMethod, Record<string, unknown>> = {
  propagation: { expression: "", variables: [{ name: "x", value: 1, uncertainty: 0.01 }], units: "" },
  logarithmic: { result_value: 1, units: "", terms: [{ value: 1, uncertainty: 0 }] },
};

const cloneDefaultPayload = (method: CalculationMethod) => JSON.parse(JSON.stringify(defaultPayload[method]));

const parseNumberList = (value: string) =>
  value
    .split(/[;,\s]+/)
    .map((token) => token.trim())
    .filter(Boolean)
    .map((token) => Number(token))
    .filter((num) => Number.isFinite(num));

const formatNumberList = (value: unknown): string => (Array.isArray(value) ? value.join(", ") : "");

export const CalculationBlockEditor = ({ block }: Props) => {
  const updateBlock = useCanvasStore((state) => state.updateBlock);
  const updatePayload = useCanvasStore((state) => state.updateBlockPayload);
  const payload = block.payload as Record<string, unknown>;

  const handlePayloadChange = (changes: Record<string, unknown>) => {
    updatePayload(block.id, changes);
  };

  const renderMethodFields = () => {
    switch (block.method) {
      case "propagation": {
        const variables = (payload.variables as Array<Record<string, number | string>>) ?? [];
        return (
          <Fragment>
            <label>
              表达式 (Python / SymPy 语法)
              <input value={(payload.expression as string | undefined) ?? ""} onChange={(event) => handlePayloadChange({ expression: event.target.value })} />
            </label>
            <div className="table-editor">
              <table>
                <thead>
                  <tr>
                    <th>名称</th>
                    <th>数值</th>
                    <th>不确定度</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {variables.map((variable, index) => (
                    <tr key={`${block.id}-var-${index}`}>
                      <td>
                        <input
                          value={(variable.name as string) ?? ""}
                          onChange={(event) => {
                            const next = [...variables];
                            next[index] = { ...next[index], name: event.target.value };
                            handlePayloadChange({ variables: next });
                          }}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          step="any"
                          value={(variable.value as number | undefined) ?? 0}
                          onChange={(event) => {
                            const next = [...variables];
                            next[index] = { ...next[index], value: Number(event.target.value) };
                            handlePayloadChange({ variables: next });
                          }}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          step="any"
                          value={(variable.uncertainty as number | undefined) ?? 0}
                          onChange={(event) => {
                            const next = [...variables];
                            next[index] = { ...next[index], uncertainty: Number(event.target.value) };
                            handlePayloadChange({ variables: next });
                          }}
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          className="button secondary"
                          onClick={() => handlePayloadChange({ variables: variables.filter((_, idx) => idx !== index) })}
                        >
                          删除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              type="button"
              className="button secondary"
              onClick={() => handlePayloadChange({ variables: [...variables, { name: "x", value: 0, uncertainty: 0 }] })}
            >
              + 添加变量
            </button>
            <label>
              单位
              <input value={(payload.units as string | undefined) ?? ""} onChange={(event) => handlePayloadChange({ units: event.target.value })} />
            </label>
          </Fragment>
        );
      }
      case "logarithmic": {
        const terms = (payload.terms as Array<Record<string, number>>) ?? [];
        return (
          <Fragment>
            <label>
              结果数值
              <input
                type="number"
                step="any"
                value={(payload.result_value as number | undefined) ?? 0}
                onChange={(event) => handlePayloadChange({ result_value: Number(event.target.value) })}
              />
            </label>
            <label>
              单位
              <input value={(payload.units as string | undefined) ?? ""} onChange={(event) => handlePayloadChange({ units: event.target.value })} />
            </label>
            <div className="table-editor">
              <table>
                <thead>
                  <tr>
                    <th>量值</th>
                    <th>不确定度</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {terms.map((term, index) => (
                    <tr key={`${block.id}-term-${index}`}>
                      <td>
                        <input
                          type="number"
                          step="any"
                          value={(term.value as number | undefined) ?? 0}
                          onChange={(event) => {
                            const next = [...terms];
                            next[index] = { ...next[index], value: Number(event.target.value) };
                            handlePayloadChange({ terms: next });
                          }}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          step="any"
                          value={(term.uncertainty as number | undefined) ?? 0}
                          onChange={(event) => {
                            const next = [...terms];
                            next[index] = { ...next[index], uncertainty: Number(event.target.value) };
                            handlePayloadChange({ terms: next });
                          }}
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          className="button secondary"
                          onClick={() => handlePayloadChange({ terms: terms.filter((_, idx) => idx !== index) })}
                        >
                          删除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              type="button"
              className="button secondary"
              onClick={() => handlePayloadChange({ terms: [...terms, { value: 1, uncertainty: 0 }] })}
            >
              + 添加因子
            </button>
          </Fragment>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div>
      <label>
        模块标题
        <input value={block.label} onChange={(event) => updateBlock(block.id, { label: event.target.value })} />
      </label>
      <label>
        计算方法
        <select
          value={block.method}
          onChange={(event) =>
            updateBlock(block.id, {
              method: event.target.value as CalculationMethod,
              payload: cloneDefaultPayload(event.target.value as CalculationMethod),
            })
          }
        >
          {methodOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      {renderMethodFields()}
      <label>
        备注
        <textarea value={block.notes ?? ""} onChange={(event) => updateBlock(block.id, { notes: event.target.value })} />
      </label>
    </div>
  );
};
