import { useState, useEffect, useCallback } from "react";
import { Block, emptyBlock } from "@/app/models/types/Block";
import { BlockPayload } from "@/app/models/types/BlockPayload";
import { BlockService } from "@/app/models/services/BlockService";

export interface BlockViewModel {
    blocks: Block[];
    addBlock: (
        index: number,
        content: string,
        type: "md" | "jsx",
        topic?: string
    ) => void;
    updateBlockContent: (
        id: number,
        content: string | BlockPayload,
        cursorPos?: number
    ) => void;
    toggleBlockSelection: (id: number) => void;
    setIsOnFocus: (id: number, state: boolean, cursorPos?: number) => void;
    deleteBlock: (id: number) => void;
}

export function useBlockViewModel(): BlockViewModel {
    const [blocks, setBlocks] = useState<Block[]>([emptyBlock]);

    useEffect(() => {
        setBlocks(BlockService.getBlocks());
    }, []);

    const updateBlocks = useCallback((newBlocks: Block[]) => {
        setBlocks(newBlocks);
        BlockService.setBlocks(newBlocks);
    }, []);

    const addBlock = useCallback(
        (
            index: number,
            content: string,
            type: "md" | "jsx" = "md",
            topic: string = ""
        ) => {
            const newBlock: Block = {
                id: index + 1,
                type,
                topic,
                cursorPos: 0,
                content: content,
                isSelected: false,
                isOnFocus: false,
            };
            const newBlocks = [...blocks];
            newBlocks.splice(index + 1, 0, newBlock);
            const reorderedBlocks = newBlocks.map((block, idx) => ({
                ...block,
                id: idx + 1, // 1-based index
            }));
            updateBlocks(reorderedBlocks);
        },
        [blocks, updateBlocks]
    );

    const updateBlockContent = useCallback(
        (id: number, content: string | BlockPayload, cursorPos?: number) => {
            setBlocks((prevBlocks) => {
                const updatedBlocks = prevBlocks.map((block) =>
                    block.id === id
                        ? { ...block, content: content, cursorPos: cursorPos }
                        : block
                );
                BlockService.setBlocks(updatedBlocks);
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

    const setIsOnFocus = useCallback(
        (id: number, state: boolean, cursorPos?: number) => {
            setBlocks((prevBlocks) => {
                const updatedBlocks = prevBlocks.map((block) =>
                    block.id === id
                        ? {
                              ...block,
                              isOnFocus: state,
                              cursorPos: cursorPos,
                          }
                        : block
                );
                BlockService.setBlocks(updatedBlocks);
                return [...updatedBlocks];
            });
        },
        []
    );

    const deleteBlock = useCallback(
        (id: number) => {
            const reorderedBlocks = blocks
                .filter((block) => block.id !== id)
                .map((block, idx) => ({
                    ...block,
                    id: idx + 1, // 1-based index
                }));
            updateBlocks(reorderedBlocks);
        },
        [blocks, updateBlocks]
    );

    return {
        blocks,
        addBlock,
        updateBlockContent,
        toggleBlockSelection,
        setIsOnFocus,
        deleteBlock,
    };
}
