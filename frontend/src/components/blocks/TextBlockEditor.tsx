import { useCanvasStore } from "../../store/useCanvasStore";
import type { TextBlock } from "../../types/blocks";

interface Props {
  block: TextBlock;
}

export const TextBlockEditor = ({ block }: Props) => {
  const updateBlock = useCanvasStore((state) => state.updateBlock);

  return (
    <div>
      <label>
        小节标题
        <input value={block.heading ?? ""} onChange={(event) => updateBlock(block.id, { heading: event.target.value })} />
      </label>
      <label>
        正文
        <textarea value={block.content} onChange={(event) => updateBlock(block.id, { content: event.target.value })} />
      </label>
    </div>
  );
};
