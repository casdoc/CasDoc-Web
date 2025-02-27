import React from "react";
import ReactMarkdown from "react-markdown";
import { MarkdownBlock } from "../../types";

interface MarkdownViewModeProps {
    block: MarkdownBlock;
    onStartEditing: () => void;
}

export default function MarkdownViewMode({
    block,
    onStartEditing,
}: MarkdownViewModeProps) {
    return (
        <div onClick={onStartEditing} className="cursor-pointer">
            <ReactMarkdown>{block.content}</ReactMarkdown>
        </div>
    );
}
