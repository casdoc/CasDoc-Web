import { useState, useEffect, useCallback } from "react";
import { Block } from "@/app/types/Block";
import { BlockPayload } from "@/app/types/BlockPayload";
import { EditorModel } from "@/app/models/editor/EditorModel";
import { set } from "lodash";

export function useEditorViewModel() {
    const [blocks, setBlocks] = useState<Block[]>([]);

    useEffect(() => {
        setBlocks(EditorModel.getBlocks());
    }, []);

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
            setBlocks((prevBlocks) => {
                const updatedBlocks = prevBlocks.map((block) =>
                    block.id === id ? { ...block, content } : block
                );
                EditorModel.setBlocks(updatedBlocks);
                return [...updatedBlocks];
            });
        },
        []
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

    const setIsEditing = useCallback((id: number, state: boolean) => {
        setBlocks((prevBlocks) => {
            const updatedBlocks = prevBlocks.map((block) =>
                block.id === id ? { ...block, isEditing: state } : block
            );
            EditorModel.setBlocks(updatedBlocks);
            return [...updatedBlocks];
        });
    }, []);

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
        setIsEditing,
        deleteBlock,
    };
}
