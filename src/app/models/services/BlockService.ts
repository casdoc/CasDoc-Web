import { Block, emptyBlock } from "../types/Block";

const LOCAL_STORAGE_KEY = "BLOCKS";

export const BlockService = {
    getBlocks(): Block[] {
        if (typeof window === "undefined") return [emptyBlock];
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [emptyBlock];
    },

    setBlocks(blocks: Block[]): void {
        console.debug("setBlocks", blocks);
        if (typeof window !== "undefined") {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(blocks));
        }
    },
};
