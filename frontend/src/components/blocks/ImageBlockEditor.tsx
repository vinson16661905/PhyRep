import { useCanvasStore } from "../../store/useCanvasStore";
import type { ImageBlock } from "../../types/blocks";

interface Props {
  block: ImageBlock;
}

export const ImageBlockEditor = ({ block }: Props) => {
  const updateBlock = useCanvasStore((state) => state.updateBlock);

  return (
    <div>
      <label>
        图片路径 / URL
        <input value={block.url} onChange={(event) => updateBlock(block.id, { url: event.target.value })} />
      </label>
      <label>
        宽度 (单位: LaTeX)
        <input value={block.width ?? ""} onChange={(event) => updateBlock(block.id, { width: event.target.value })} />
      </label>
      <label>
        图注
        <input value={block.caption ?? ""} onChange={(event) => updateBlock(block.id, { caption: event.target.value })} />
      </label>
    </div>
  );
};
