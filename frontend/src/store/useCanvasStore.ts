import { create } from "zustand";

import type {
  Block,
  BlockType,
  CalculationBlock,
  ReportMeta,
  TableBlock,
  TextBlock,
} from "../types/blocks";

const uuid = () => (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2));

const defaultMeta: ReportMeta = {
  experiment: "待定实验",
  student: "学生姓名",
  student_id: "2500011XXX",
  date: new Date().toISOString().slice(0, 10),
};

const createBlock = (type: BlockType): Block => {
    switch (type) {
        case "text":
            return { id: uuid(), type, heading: "", content: "" } as TextBlock;
        case "table":
            return {
                id: uuid(),
                type,
                caption: "",
                headers: ["列1", "列2"],
                rows: [["", ""]],
            } as TableBlock;
        case "formula":
            return { id: uuid(), type, latex: "", caption: "" };
        case "image":
            return {
                id: uuid(),
                type,
                url: "path/to/image",
                caption: "",
                width: "0.7\\textwidth",
            };
        case "calculation":
            return {
                id: uuid(),
                type,
                label: "数据处理",
                method: "propagation",
                payload: { expression: "", variables: [{ name: "x", value: 1, uncertainty: 0.01 }], units: "" },
                notes: "",
            } as CalculationBlock;
        default: {
          const exhaustive: never = type;
          throw new Error(`Unsupported block type: ${exhaustive}`);
        }
    }
};

const reorder = (list: Block[], fromId: string, toId: string): Block[] => {
  const fromIndex = list.findIndex((b) => b.id === fromId);
  const toIndex = list.findIndex((b) => b.id === toId);
  if (fromIndex === -1 || toIndex === -1) return list;
  const updated = [...list];
  const [item] = updated.splice(fromIndex, 1);
  updated.splice(toIndex, 0, item);
  return updated;
};

interface CanvasState {
  meta: ReportMeta;
  blocks: Block[];
  addBlock: (type: BlockType) => void;
  updateBlock: (id: string, patch: Partial<Block>) => void;
  updateBlockPayload: (id: string, payload: Record<string, unknown>) => void;
  removeBlock: (id: string) => void;
  reorderBlocks: (fromId: string, toId: string) => void;
  setMeta: (updates: Partial<ReportMeta>) => void;
  reset: () => void;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  meta: defaultMeta,
  blocks: [],
  addBlock: (type) => set((state) => ({ blocks: [...state.blocks, createBlock(type)] })),
  updateBlock: (id, patch) =>
    set((state) => ({
      blocks: state.blocks.map((block) => (block.id === id ? ({ ...block, ...patch } as Block) : block)),
    })),
  updateBlockPayload: (id, payload) =>
    set((state) => ({
      blocks: state.blocks.map((block) =>
        block.id === id && block.type === "calculation"
          ? ({ ...block, payload: { ...block.payload, ...payload } } as CalculationBlock)
          : block
      ),
    })),
  removeBlock: (id) => set((state) => ({ blocks: state.blocks.filter((block) => block.id !== id) })),
  reorderBlocks: (fromId, toId) => set((state) => ({ blocks: reorder(state.blocks, fromId, toId) })),
  setMeta: (updates) => set({ meta: { ...get().meta, ...updates } }),
  reset: () => set({ meta: defaultMeta, blocks: [] }),
}));
