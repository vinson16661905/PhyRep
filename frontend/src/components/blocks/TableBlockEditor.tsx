import { useCallback, useState } from "react";

import { useCanvasStore } from "../../store/useCanvasStore";
import type { TableBlock, TableAnalysis, TableAnalysisType } from "../../types/blocks";

interface Props {
  block: TableBlock;
}

export const TableBlockEditor = ({ block }: Props) => {
  const updateBlock = useCanvasStore((state) => state.updateBlock);

  const updateHeaders = (index: number, value: string) => {
    const headers = [...block.headers];
    headers[index] = value;
    updateBlock(block.id, { headers });
  };

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    const rows = block.rows.map((row, idx) =>
      idx === rowIndex ? row.map((cell, cIdx) => (cIdx === colIndex ? value : cell)) : row
    );
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
    const newAnalysis: TableAnalysis = {
      type: "uncertainty_single_set",
      params: { colIndex: 0, tolerance: 0.01 },
    };
    updateBlock(block.id, { analysis: [...(block.analysis || []), newAnalysis] });
  };

  const removeAnalysis = (index: number) => {
    const newAnalysis = [...(block.analysis || [])];
    newAnalysis.splice(index, 1);
    updateBlock(block.id, { analysis: newAnalysis });
  };

  const updateAnalysis = (index: number, changes: Partial<TableAnalysis>) => {
    const newAnalysis = [...(block.analysis || [])];
    newAnalysis[index] = { ...newAnalysis[index], ...changes };
    updateBlock(block.id, { analysis: newAnalysis });
  };

  const updateAnalysisParams = (index: number, params: Record<string, unknown>) => {
    const newAnalysis = [...(block.analysis || [])];
    newAnalysis[index] = { ...newAnalysis[index], params: { ...newAnalysis[index].params, ...params } };
    updateBlock(block.id, { analysis: newAnalysis });
  };

  return (
    <div>
      <label>
        表格标题
        <input value={block.caption ?? ""} onChange={(event) => updateBlock(block.id, { caption: event.target.value })} />
      </label>
      <div className="table-editor">
        <table>
          <thead>
            <tr>
              {block.headers.map((header, index) => (
                <th key={index}>
                  <input value={header} onChange={(event) => updateHeaders(index, event.target.value)} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, rowIndex) => (
              <tr key={`${block.id}-${rowIndex}`}>
                {row.map((cell, colIndex) => (
                  <td key={`${rowIndex}-${colIndex}`}>
                    <input value={cell} onChange={(event) => updateCell(rowIndex, colIndex, event.target.value)} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="controls">
        <button type="button" className="button secondary" onClick={addRow}>
          + 新增一行
        </button>
        <button type="button" className="button secondary" onClick={addColumn}>
          + 新增一列
        </button>
      </div>

      <div className="analysis-section">
        <h4>数据分析</h4>
        {(block.analysis || []).map((item, index) => (
          <div key={index} className="analysis-item">
            <div className="analysis-header">
              <select
                value={item.type}
                onChange={(e) => updateAnalysis(index, { type: e.target.value as TableAnalysisType })}
              >
                <option value="uncertainty_single_set">单变量不确定度</option>
                <option value="successive_difference">逐差法</option>
                <option value="least_squares">最小二乘法</option>
              </select>
              <button type="button" className="button danger" onClick={() => removeAnalysis(index)}>删除</button>
            </div>
            
            <div className="analysis-body">
              {item.type === "uncertainty_single_set" && (
                <>
                  <label>
                    选择列
                    <select
                      value={(item.params.colIndex as number) ?? 0}
                      onChange={(e) => updateAnalysisParams(index, { colIndex: Number(e.target.value) })}
                    >
                      {block.headers.map((h, i) => <option key={i} value={i}>{h || `列 ${i+1}`}</option>)}
                    </select>
                  </label>
                  <label>
                    允差 (e)
                    <input
                      type="number"
                      step="any"
                      value={(item.params.tolerance as number) ?? 0.01}
                      onChange={(e) => updateAnalysisParams(index, { tolerance: Number(e.target.value) })}
                    />
                  </label>
                </>
              )}

              {item.type === "successive_difference" && (
                <>
                  <label>
                    选择列
                    <select
                      value={(item.params.colIndex as number) ?? 0}
                      onChange={(e) => updateAnalysisParams(index, { colIndex: Number(e.target.value) })}
                    >
                      {block.headers.map((h, i) => <option key={i} value={i}>{h || `列 ${i+1}`}</option>)}
                    </select>
                  </label>
                  <label>
                    步长 (Interval)
                    <input
                      type="number"
                      value={(item.params.interval as number) ?? 1}
                      onChange={(e) => updateAnalysisParams(index, { interval: Number(e.target.value) })}
                    />
                  </label>
                </>
              )}

              {item.type === "least_squares" && (
                <>
                  <label>
                    X 数据列
                    <select
                      value={(item.params.xColIndex as number) ?? 0}
                      onChange={(e) => updateAnalysisParams(index, { xColIndex: Number(e.target.value) })}
                    >
                      {block.headers.map((h, i) => <option key={i} value={i}>{h || `列 ${i+1}`}</option>)}
                    </select>
                  </label>
                  <label>
                    Y 数据列
                    <select
                      value={(item.params.yColIndex as number) ?? 1}
                      onChange={(e) => updateAnalysisParams(index, { yColIndex: Number(e.target.value) })}
                    >
                      {block.headers.map((h, i) => <option key={i} value={i}>{h || `列 ${i+1}`}</option>)}
                    </select>
                  </label>
                </>
              )}
            </div>
          </div>
        ))}
        <button type="button" className="button secondary" onClick={addAnalysis}>
          + 添加分析
        </button>
      </div>
    </div>
  );
};
