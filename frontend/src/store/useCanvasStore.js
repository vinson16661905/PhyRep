import { create } from "zustand";
const uuid = () => (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2));
const defaultMeta = {
    experiment: "待定实验",
    student: "学生姓名",
    student_id: "2500011XXX",
    date: new Date().toISOString().slice(0, 10),
};
const createBlock = (type) => {
    switch (type) {
        case "text":
            return { id: uuid(), type, heading: "", content: "" };
        case "table":
            return {
                id: uuid(),
                type,
                caption: "",
                headers: ["列1", "列2"],
                rows: [["", ""]],
            };
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
            };
        default: {
            const exhaustive = type;
            throw new Error(`Unsupported block type: ${exhaustive}`);
        }
    }
};
const reorder = (list, fromId, toId) => {
    const fromIndex = list.findIndex((b) => b.id === fromId);
    const toIndex = list.findIndex((b) => b.id === toId);
    if (fromIndex === -1 || toIndex === -1)
        return list;
    const updated = [...list];
    const [item] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, item);
    return updated;
};
export const useCanvasStore = create((set, get) => ({
    meta: defaultMeta,
    blocks: [],
    addBlock: (type) => set((state) => ({ blocks: [...state.blocks, createBlock(type)] })),
    updateBlock: (id, patch) => set((state) => ({
        blocks: state.blocks.map((block) => (block.id === id ? { ...block, ...patch } : block)),
    })),
    updateBlockPayload: (id, payload) => set((state) => ({
        blocks: state.blocks.map((block) => block.id === id && block.type === "calculation"
            ? { ...block, payload: { ...block.payload, ...payload } }
            : block),
    })),
    removeBlock: (id) => set((state) => ({ blocks: state.blocks.filter((block) => block.id !== id) })),
    reorderBlocks: (fromId, toId) => set((state) => ({ blocks: reorder(state.blocks, fromId, toId) })),
    setMeta: (updates) => set({ meta: { ...get().meta, ...updates } }),
    reset: () => set({ meta: defaultMeta, blocks: [] }),
}));
