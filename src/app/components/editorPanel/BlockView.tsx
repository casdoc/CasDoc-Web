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
    setIsOnFocus: (id: number, state: boolean) => void;
    addBlock: (index: number, type: "md" | "jsx", topic: string) => void;
}

export const BlockView: React.FC<BlockViewProps> = ({
    block,
    updateBlockContent,
    toggleBlockSelection,
    setIsOnFocus,
    addBlock,
}) => {
    const { id, type, topic, content, isSelected, isOnFocus } = block;
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    console.debug("刷新BlockView", block);
    //auto adjust textarea height
    useEffect(() => {
        if (isOnFocus && textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height =
                textareaRef.current.scrollHeight + "px";
            textareaRef.current.focus();
        }
    }, [isOnFocus, content]);

    const handleClick = () => {
        console.debug("block 被點擊");
        toggleBlockSelection(id);
    };

    const handleClickTextarea = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        e.stopPropagation();
        console.debug("textarea 被點擊");
        console.debug("更新前isEditing", isOnFocus);
        setIsOnFocus(id, true);
        console.debug("更新後isEditing", isOnFocus);
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateBlockContent(id, e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            setIsOnFocus(id, !isOnFocus);
            addBlock(id, "md", "");
            setIsOnFocus(id + 1, !isOnFocus);
        } else if (e.key === "Escape") {
            setIsOnFocus(id, !isOnFocus);
        }
    };
    const handleFocus = () => {
        console.debug("handleFocus isEditing", isOnFocus);
        console.debug("textarea 獲得焦點");
    };

    const handleBlur = () => {
        setIsOnFocus(id, !isOnFocus);
        console.debug("textarea 失去焦點");
    };
    return (
        // <div
        //     className={`group flex  rounded-md min-h-6   ${
        //         isSelected ? "bg-blue-300" : "bg-yellow-400"
        //     }`}
        //     onClick={handleClick}
        // >
        <div
            className={`group flex flex-row  min-h-6 px-6 items-stretch justify-stretch ${
                isSelected ? "bg-blue-300" : "bg-yellow-400"
            } `}
        >
            {isOnFocus && type === "md" ? (
                <textarea
                    ref={textareaRef}
                    className="w-full resize-none border-none  focus:outline-none  min-h-6  leading-7 bg-green-400 "
                    value={typeof content === "string" ? content : ""}
                    onChange={handleContentChange}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    rows={1}
                />
            ) : (
                <div
                    className="w-full bg-red-50 h-full prose  min-h-6 min-w-full overflow-wrap-normal break-words whitespace-normal overflow-x-hidden"
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
        // </div>
    );
};
