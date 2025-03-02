import { useState, useEffect, useCallback } from "react";
import { Block } from "@/app/types/Block";
import { BlockPayload } from "@/app/types/BlockPayload";
import { BlockService } from "@/app/models/services/BlockService";

export interface BlockViewModel {
    blocks: Block[];
    addBlock: (index: number, type?: "md" | "jsx", topic?: string) => void;
    updateBlockContent: (id: number, content: string | BlockPayload) => void;
    toggleBlockSelection: (id: number) => void;
    setIsOnFocus: (id: number, state: boolean) => void;
    deleteBlock: (id: number) => void;
}

export function useBlockViewModel(): BlockViewModel {
    const [blocks, setBlocks] = useState<Block[]>([]);

    useEffect(() => {
        setBlocks(BlockService.getBlocks());
    }, []);

    const updateBlocks = useCallback((newBlocks: Block[]) => {
        setBlocks(newBlocks);
        BlockService.setBlocks(newBlocks);
    }, []);

    const addBlock = useCallback(
        (index: number, type: "md" | "jsx" = "md", topic: string = "") => {
            const id = blocks.reduce(
                (acc, block) => Math.max(acc, block.id),
                0
            );
            const newBlock: Block = {
                id: id + 1,
                type,
                topic,
                content: "",
                isSelected: false,
                isOnFocus: false,
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

    const setIsOnFocus = useCallback((id: number, state: boolean) => {
        setBlocks((prevBlocks) => {
            const updatedBlocks = prevBlocks.map((block) =>
                block.id === id ? { ...block, isOnFocus: state } : block
            );
            BlockService.setBlocks(updatedBlocks);
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
        setIsOnFocus,
        deleteBlock,
    };
}
