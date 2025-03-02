import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { Block, EditorState, BlockType } from "../types/editor";

interface EditorStore extends EditorState {
    addBlock: (
        index: number,
        content?: string,
        type?: BlockType,
        component?: string
    ) => void;
    updateBlockContent: (id: string, content: string) => void;
    convertBlockToComponent: (id: string, component: string) => void;
    deleteBlock: (id: string) => void;
    moveBlockUp: (id: string) => void;
    moveBlockDown: (id: string) => void;

    setActiveBlock: (id: string | null) => void;
    setEditingBlock: (id: string | null) => void;

    handleEnterKey: (id: string) => void;
    handleEscapeKey: () => void;
}

export const useEditorStore = create<EditorStore>((set, get) => ({
    blocks: [{ id: uuidv4(), type: "markdown", content: "" }],
    activeBlockId: null,
    editingBlockId: null,

    addBlock: (index, content = "", type = "markdown", component) =>
        set((state) => {
            const newBlock: Block = {
                id: uuidv4(),
                type,
                content,
                component,
            };
            const updatedBlocks = [...state.blocks];
            updatedBlocks.splice(index + 1, 0, newBlock);
            return {
                blocks: updatedBlocks,
                activeBlockId: newBlock.id,
                editingBlockId: newBlock.id,
            };
        }),

    updateBlockContent: (id, content) =>
        set((state) => ({
            blocks: state.blocks.map((block) =>
                block.id === id ? { ...block, content } : block
            ),
        })),

    convertBlockToComponent: (id, component) =>
        set((state) => ({
            blocks: state.blocks.map((block) =>
                block.id === id ? { ...block, type: "jsx", component } : block
            ),
            editingBlockId: null,
        })),

    deleteBlock: (id) =>
        set((state) => {
            if (state.blocks.length <= 1) {
                return {
                    blocks: [{ id: uuidv4(), type: "markdown", content: "" }],
                    activeBlockId: null,
                    editingBlockId: null,
                };
            }

            const blockIndex = state.blocks.findIndex((b) => b.id === id);
            const updatedBlocks = state.blocks.filter(
                (block) => block.id !== id
            );

            const newActiveBlockId =
                updatedBlocks[Math.min(blockIndex, updatedBlocks.length - 1)]
                    ?.id || null;

            return {
                blocks: updatedBlocks,
                activeBlockId: newActiveBlockId,
                editingBlockId: null,
            };
        }),

    moveBlockUp: (id) =>
        set((state) => {
            const blockIndex = state.blocks.findIndex((b) => b.id === id);
            if (blockIndex <= 0) return state;

            const updatedBlocks = [...state.blocks];
            const blockToMove = updatedBlocks[blockIndex];
            updatedBlocks.splice(blockIndex, 1);
            updatedBlocks.splice(blockIndex - 1, 0, blockToMove);

            return { blocks: updatedBlocks };
        }),

    moveBlockDown: (id) =>
        set((state) => {
            const blockIndex = state.blocks.findIndex((b) => b.id === id);
            if (blockIndex >= state.blocks.length - 1) return state;

            const updatedBlocks = [...state.blocks];
            const blockToMove = updatedBlocks[blockIndex];
            updatedBlocks.splice(blockIndex, 1);
            updatedBlocks.splice(blockIndex + 1, 0, blockToMove);

            return { blocks: updatedBlocks };
        }),

    setActiveBlock: (id) => set({ activeBlockId: id }),

    setEditingBlock: (id) => set({ editingBlockId: id }),

    handleEnterKey: (id) => {
        const state = get();
        const blockIndex = state.blocks.findIndex((b) => b.id === id);
        const block = state.blocks[blockIndex];

        const isList = /^(\s*[-*+]\s|\s*\d+\.\s)/.test(block.content);
        const isEmpty = block.content.trim() === "";

        if (isList && isEmpty) {
            state.updateBlockContent(id, "");
            return;
        } else if (isList) {
            const listMarker =
                block.content.match(/^(\s*[-*+]\s|\s*\d+\.\s)/)?.[0] || "";
            state.addBlock(blockIndex, listMarker);
        } else {
            state.addBlock(blockIndex);
        }
    },

    handleEscapeKey: () => set({ editingBlockId: null }),
}));
