import { useCanvasStore } from "../../store/useCanvasStore";
import type { FormulaBlock } from "../../types/blocks";

interface Props {
  block: FormulaBlock;
}

export const FormulaBlockEditor = ({ block }: Props) => {
  const updateBlock = useCanvasStore((state) => state.updateBlock);

  return (
    <div>
      <label>
        公式 (LaTeX)
        <textarea value={block.latex} onChange={(event) => updateBlock(block.id, { latex: event.target.value })} />
      </label>
      <label>
        说明
        <input value={block.caption ?? ""} onChange={(event) => updateBlock(block.id, { caption: event.target.value })} />
      </label>
    </div>
  );
};
