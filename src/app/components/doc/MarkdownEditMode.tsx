import React, { useState, useEffect } from "react";
import { determineBlockType } from "../../utils/blockUtils";
import { MarkdownBlock, MarkdownBlockType } from "../../types";

interface MarkdownEditModeProps {
    block: MarkdownBlock;
    onUpdateBlock: (updatedBlock: MarkdownBlock) => void;
    onStopEditing: () => void;
    addNewBlockAfterCurrent: (type: MarkdownBlockType) => void;
}

export default function MarkdownEditMode({
    block,
    onUpdateBlock,
    onStopEditing,
    addNewBlockAfterCurrent,
}: MarkdownEditModeProps) {
    const [content, setContent] = useState(block.content);

    useEffect(() => {
        const newType = determineBlockType(content);
        if (newType !== block.type) {
            const updatedBlock: MarkdownBlock = {
                ...block,
                type: newType,
                content,
            };
            onUpdateBlock(updatedBlock);
        }
    }, [content, block, onUpdateBlock]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
        setContent(e.target.value);

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addNewBlockAfterCurrent(block.type);
            onStopEditing();
        }
    };

    return (
        <textarea
            value={content}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            className="w-full p-2 border"
            autoFocus
        />
    );
}
