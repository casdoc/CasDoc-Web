import { useState, useCallback, useEffect, useRef } from "react";
export interface DocumentViewModel {
    BlockPosList: number[];
    updateBlockPosList: (newBlockPosList: number[]) => void;
}

export function useDocumentViewModel(): DocumentViewModel {
    const BlockPosList = useRef<number[]>([]);

    const updateBlockPosList = useCallback((newBlockPosList: number[]) => {
        BlockPosList.current = newBlockPosList;
    }, []);

    return { BlockPosList: BlockPosList.current, updateBlockPosList };
}
