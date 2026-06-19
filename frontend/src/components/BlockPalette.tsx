import { useCanvasStore } from "../store/useCanvasStore";
import type { BlockType } from "../types/blocks";

const palette: { type: BlockType; label: string; description: string }[] = [
  { type: "text", label: "文本", description: "描述、理论、结论等段落" },
  { type: "table", label: "数据表", description: "实验原始数据或处理表格" },
  { type: "formula", label: "公式", description: "LaTeX 公式展示" },
  { type: "image", label: "图像", description: "实验装置或图表" },
  { type: "calculation", label: "数据处理", description: "不确定度 / 拟合计算" },
];

export const BlockPalette = () => {
  const addBlock = useCanvasStore((state) => state.addBlock);

  return (
    <div className="panel palette">
      <h2>模块库</h2>
      {palette.map((item) => (
        <button key={item.type} className="button" onClick={() => addBlock(item.type)}>
          <strong>{item.label}</strong>
          <div style={{ fontSize: "0.85rem", color: "var(--panel-text, #0a1c28)" }}>{item.description}</div>
        </button>
      ))}
    </div>
  );
};
