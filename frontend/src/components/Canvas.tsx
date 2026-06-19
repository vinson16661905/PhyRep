import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { CSSProperties } from "react";

import { useCanvasStore } from "../store/useCanvasStore";
import type { Block } from "../types/blocks";
import { CalculationBlockEditor } from "./blocks/CalculationBlockEditor";
import { FormulaBlockEditor } from "./blocks/FormulaBlockEditor";
import { ImageBlockEditor } from "./blocks/ImageBlockEditor";
import { TableBlockEditor } from "./blocks/TableBlockEditor";
import { TextBlockEditor } from "./blocks/TextBlockEditor";

const BlockCard = ({ block }: { block: Block }) => {
  const removeBlock = useCanvasStore((state) => state.removeBlock);
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: block.id });
  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const renderEditor = () => {
    switch (block.type) {
      case "text":
        return <TextBlockEditor block={block} />;
      case "table":
        return <TableBlockEditor block={block} />;
      case "formula":
        return <FormulaBlockEditor block={block} />;
      case "image":
        return <ImageBlockEditor block={block} />;
      case "calculation":
        return <CalculationBlockEditor block={block} />;
      default:
        return null;
    }
  };

  const blockTitleMap: Record<Block["type"], string> = {
    text: "文本",
    table: "表格",
    formula: "公式",
    image: "图像",
    calculation: "数据处理",
  } as const;

  return (
    <div className="block-card" ref={setNodeRef} style={style}>
      <header>
        <div {...attributes} {...listeners} style={{ cursor: "grab" }}>
          <h4>
            {blockTitleMap[block.type]} {block.type === "text" && block.heading ? `｜${block.heading}` : ""}
          </h4>
        </div>
        <button type="button" className="button secondary" onClick={() => removeBlock(block.id)}>
          删除
        </button>
      </header>
      {renderEditor()}
    </div>
  );
};

export const Canvas = () => {
  const blocks = useCanvasStore((state) => state.blocks);
  const reorderBlocks = useCanvasStore((state) => state.reorderBlocks);
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    reorderBlocks(String(active.id), String(over.id));
  };

  return (
    <div className="panel canvas">
      <h2>报告画布</h2>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext items={blocks.map((block) => block.id)}>
          {blocks.length === 0 && <p>将左侧模块拖入此处开始构建实验报告。</p>}
          {blocks.map((block) => (
            <BlockCard key={block.id} block={block} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};
