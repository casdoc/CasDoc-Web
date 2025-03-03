export type BlockType = "markdown" | "jsx";

export interface Block {
    id: string;
    type: BlockType;
    content: string;
    component?: string; // 只有當type為jsx時才有值
}

export interface EditorState {
    blocks: Block[];
    activeBlockId: string | null;
    editingBlockId: string | null;
}
