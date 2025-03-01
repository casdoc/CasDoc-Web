const LOCAL_STORAGE_KEY = "editorBlocks";
import { Block } from "../../types/Block";
export const EditorModel = {
    getBlocks(): Block[] {
        if (typeof window === "undefined") return [];
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    },

    setBlocks(blocks: Block[]): void {
        if (typeof window !== "undefined") {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(blocks));
        }
    },
};
