import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { useEditorViewModel } from "@/app/viewModels/editor/EditorViewModel";
import { Block } from "@/app/types/Block";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
interface BlockViewProps {
    block: Block;
}

export const BlockView: React.FC<BlockViewProps> = ({ block }) => {
    const { id, type, topic, content, isSelected, isEditing } = block;
    const {
        updateBlockContent,
        toggleBlockSelection,
        toggleBlockEditing,
        addBlock,
    } = useEditorViewModel();
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

    const handleDoubleClick = () => {
        console.debug("handleDoubleClick");
        toggleBlockEditing(id);
        console.debug("isEditing", isEditing);
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        console.debug("更新block內容", e.target.value);
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

    return (
        <div
            className={`group flex items-start rounded-md h-10 ${
                isSelected ? "bg-blue-300" : "bg-gray-100"
            }`}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
        >
            <div className="flex-grow">
                {isEditing && type === "md" ? (
                    <textarea
                        ref={textareaRef}
                        className="w-full resize-none border-none focus:outline-none bg-transparent"
                        value={typeof content === "string" ? content : ""}
                        onChange={handleContentChange}
                        onKeyDown={handleKeyDown}
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
