import { BlockPayload } from "./BlockPayload";

/**
 * Represents a block structure that can hold Markdown or JSX content.
 */
export interface Block {
    /** The position of the block in the list. */
    id: number;

    /** The type of the block, either Markdown (`md`) or JSX (`jsx`). */
    type: "md" | "jsx";

    /** The topic or title of the block. */
    topic: string;

    /**
     * The content of the block.
     * - If `type` is `"md"`, it will be a **Markdown string**.
     * - If `type` is `"jsx"`, it will be a **JSX component payload**.
     */
    content: string | BlockPayload;

    /** Indicates whether the block is currently selected. */
    isSelected: boolean;

    /** Indicates whether the block is being edited. */
    isOnFocus: boolean;
}
