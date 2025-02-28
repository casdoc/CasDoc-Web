import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Block } from "@/app/types/Block";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import { BlockPayload } from "@/app/types/BlockPayload";

interface BlockViewProps {
    block: Block;
    updateBlockContent: (id: number, content: string | BlockPayload) => void;
    toggleBlockSelection: (id: number) => void;
    toggleBlockEditing: (id: number) => void;
    addBlock: (index: number, type: "md" | "jsx", topic: string) => void;
}

export const BlockView: React.FC<BlockViewProps> = ({
    block,
    updateBlockContent,
    toggleBlockSelection,
    toggleBlockEditing,
    addBlock,
}) => {
    const { id, type, topic, content, isSelected, isEditing } = block;
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    //auto adjust textarea height
    useEffect(() => {
        if (isEditing && textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height =
                textareaRef.current.scrollHeight + "px";
            textareaRef.current.focus();
        }
    }, [isEditing, content]);

    const handleClick = () => {
        toggleBlockSelection(id);
    };

    const handleClickTextarea = () => {
        toggleBlockEditing(id);
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateBlockContent(id, e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            toggleBlockEditing(id);
            addBlock(id, "md", "");
            toggleBlockEditing(id + 1);
        } else if (e.key === "Escape") {
            toggleBlockEditing(id);
        }
    };
    const handleFocus = () => {
        toggleBlockEditing(id);
        console.debug("textarea 獲得焦點");
    };

    const handleBlur = () => {
        toggleBlockEditing(id);
        console.debug("textarea 失去焦點");
    };
    return (
        <div
            className={`group flex items-start rounded-md h-10 ${
                isSelected ? "bg-blue-300" : "bg-gray-100"
            }`}
            onClick={handleClick}
        >
            <div className="flex-grow px-4">
                {type === "md" ? (
                    <textarea
                        ref={textareaRef}
                        className="w-full resize-none border-none focus:outline-none bg-transparent bg-green-400 "
                        value={typeof content === "string" ? content : ""}
                        onChange={handleContentChange}
                        onKeyDown={handleKeyDown}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onClick={handleClickTextarea}
                        rows={1}
                    />
                ) : (
                    <div className="prose prose-sm max-w-none">
                        {type === "md" ? (
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm, remarkBreaks]}
                                rehypePlugins={[rehypeRaw]}
                            >
                                {typeof content === "string" ? content : ""}
                            </ReactMarkdown>
                        ) : (
                            <p>Custom JSX Component</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
