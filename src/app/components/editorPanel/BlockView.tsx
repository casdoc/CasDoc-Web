import React, { useEffect, useRef } from "react";
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
    setIsEditing: (id: number, state: boolean) => void;
    addBlock: (index: number, type: "md" | "jsx", topic: string) => void;
}

export const BlockView: React.FC<BlockViewProps> = ({
    block,
    updateBlockContent,
    toggleBlockSelection,
    setIsEditing,
    addBlock,
}) => {
    const { id, type, topic, content, isSelected, isEditing } = block;
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    console.debug("刷新BlockView", block);
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
        console.debug("block 被點擊");
        toggleBlockSelection(id);
    };

    const handleClickTextarea = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        e.stopPropagation();
        console.debug("textarea 被點擊");
        console.debug("更新前isEditing", isEditing);
        setIsEditing(id, true);
        console.debug("更新後isEditing", isEditing);
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateBlockContent(id, e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            setIsEditing(id, !isEditing);
            addBlock(id, "md", "");
            setIsEditing(id + 1, !isEditing);
        } else if (e.key === "Escape") {
            setIsEditing(id, !isEditing);
        }
    };
    const handleFocus = () => {
        console.debug("handleFocus isEditing", isEditing);
        console.debug("textarea 獲得焦點");
    };

    const handleBlur = () => {
        setIsEditing(id, !isEditing);
        console.debug("textarea 失去焦點");
    };
    return (
        <div
            className={`group flex  rounded-md  ${
                isSelected ? "bg-blue-300" : "bg-yellow-400"
            }`}
            onClick={handleClick}
        >
            <div className="flex-grow px-4 ">
                {isEditing && type === "md" ? (
                    <textarea
                        ref={textareaRef}
                        className="w-full resize-none border-none focus:outline-none bg-transparent bg-green-400 h-full"
                        value={typeof content === "string" ? content : ""}
                        onChange={handleContentChange}
                        onKeyDown={handleKeyDown}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        rows={1}
                    />
                ) : (
                    <div
                        className="w-full bg-red-400 h-full prose  rounded-lg  overflow-auto"
                        onClick={handleClickTextarea}
                    >
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
