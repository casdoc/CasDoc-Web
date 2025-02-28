import { useState, useEffect, useCallback } from "react";
import { Block } from "@/app/types/Block";
import { BlockPayload } from "@/app/types/BlockPayload";
import { EditorModel } from "@/app/models/editor/EditorModel";

export function useEditorViewModel() {
    const [blocks, setBlocks] = useState<Block[]>([]);
    // console.debug("從EditorModel取得blocks", EditorModel.getBlocks());
    useEffect(() => {
        setBlocks(EditorModel.getBlocks());
    }, []);
    console.debug("get blocks", blocks);

    const updateBlocks = useCallback((newBlocks: Block[]) => {
        setBlocks(newBlocks);
        EditorModel.setBlocks(newBlocks);
    }, []);

    const addBlock = useCallback(
        (index: number, type: "md" | "jsx" = "md", topic: string = "") => {
            const newBlock: Block = {
                id: index + 1,
                type,
                topic,
                content: "",
                isSelected: false,
                isEditing: false,
            };
            const newBlocks = [...blocks];
            newBlocks.splice(index + 1, 0, newBlock);
            updateBlocks(newBlocks);
        },
        [blocks, updateBlocks]
    );

    const updateBlockContent = useCallback(
        (id: number, content: string | BlockPayload) => {
            console.debug("更新block內容", content);
            updateBlocks(
                blocks.map((block) =>
                    block.id === id ? { ...block, content } : block
                )
            );
        },
        [blocks, updateBlocks]
    );

    const toggleBlockSelection = useCallback(
        (id: number) => {
            updateBlocks(
                blocks.map((block) =>
                    block.id === id
                        ? { ...block, isSelected: !block.isSelected }
                        : block
                )
            );
        },
        [blocks, updateBlocks]
    );

    const toggleBlockEditing = useCallback(
        (id: number) => {
            updateBlocks(
                blocks.map((block) =>
                    block.id === id
                        ? { ...block, isEditing: !block.isEditing }
                        : block
                )
            );
        },
        [blocks, updateBlocks]
    );

    const deleteBlock = useCallback(
        (id: number) => {
            updateBlocks(blocks.filter((block) => block.id !== id));
        },
        [blocks, updateBlocks]
    );

    return {
        blocks,
        addBlock,
        updateBlockContent,
        toggleBlockSelection,
        toggleBlockEditing,
        deleteBlock,
    };
}
