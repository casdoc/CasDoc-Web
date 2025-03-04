import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import { BlockViewModel } from "@/app/viewModels/BlockViewModel";

interface BlockViewProps {
    index: number;
    blockViewModel: BlockViewModel;
}

export const BlockView = ({ index, blockViewModel }: BlockViewProps) => {
    const { blocks, addBlock, setIsOnFocus, updateBlockContent, deleteBlock } =
        blockViewModel;
    const { id, type, content, isSelected, isOnFocus } = blocks[index];
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (isOnFocus && textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height =
                textareaRef.current.scrollHeight + "px";
            textareaRef.current.focus();
            if (blocks[index].cursorPos !== undefined) {
                textareaRef.current.setSelectionRange(
                    blocks[index].cursorPos,
                    blocks[index].cursorPos
                );
            } else {
                textareaRef.current.setSelectionRange(
                    textareaRef.current.value.length,
                    textareaRef.current.value.length
                );
            }
        }
    }, [isOnFocus, content, blocks, index]);

    const handleClickBlock = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        e.stopPropagation();
        setIsOnFocus(id, true);
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateBlockContent(id, e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        const currentCursorPos = textareaRef
            ? textareaRef.current?.selectionStart
            : 0;
        console.debug("currentCursorPos", currentCursorPos);
        if (
            index > 0 &&
            (e.key === "Delete" || e.key === "Backspace") &&
            textareaRef.current &&
            textareaRef.current.selectionStart === 0
        ) {
            e.preventDefault();
            handleDeleteBlock();
            return;
        }
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            const prevIndex = id;
            const cursorPos = (e.target as HTMLTextAreaElement).selectionStart;
            const beforeContent = blocks[index].content
                .toString()
                .slice(0, cursorPos);
            const afterContent = blocks[index].content
                .toString()
                .slice(cursorPos);

            setIsOnFocus(id, false);
            addBlock(index, afterContent, "md", "");
            updateBlockContent(id, beforeContent);
            setIsOnFocus(prevIndex + 1, true);
        } else if (e.key === "Escape") {
            setIsOnFocus(index, false);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (index > 0) {
                setIsOnFocus(id, false);
                setIsOnFocus(blocks[index - 1].id, true, currentCursorPos);
            }
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            if (index < blocks.length - 1) {
                setIsOnFocus(id, false);
                setIsOnFocus(blocks[index + 1].id, true, currentCursorPos);
            }
        } else if (
            textareaRef.current &&
            textareaRef.current.selectionStart === 0 &&
            e.key === "ArrowLeft"
        ) {
            e.preventDefault();
            if (index > 0) {
                setIsOnFocus(id, false);
                setIsOnFocus(
                    blocks[index - 1].id,
                    true,
                    textareaRef.current.value.length
                );
            }
        } else if (
            textareaRef.current &&
            textareaRef.current.selectionStart ===
                textareaRef.current.value.length &&
            e.key === "ArrowRight"
        ) {
            e.preventDefault();
            if (index < blocks.length - 1) {
                setIsOnFocus(id, false);
                setIsOnFocus(blocks[index + 1].id, true, 0);
            }
        }
    };

    const handleDeleteBlock = () => {
        const previousBlockId = blocks[index - 1].id;
        const str =
            blocks[index - 1].content +
            (typeof content === "string" ? content : "");
        setIsOnFocus(id, false);
        deleteBlock(id);
        setTimeout(() => {
            setIsOnFocus(previousBlockId, true);
            updateBlockContent(previousBlockId, str);
        }, 0);
    };

    const handleBlur = () => {
        setIsOnFocus(id, !isOnFocus);
        console.debug("textarea 失去焦點");
    };

    return (
        <div
            className={`group flex flex-row min-h-6 items-stretch justify-stretch ${
                isSelected ? "bg-blue-300" : "bg-white-400"
            } `}
        >
            {isOnFocus && type === "md" ? (
                <textarea
                    ref={textareaRef}
                    className="w-full resize-none border-none focus:outline-none  min-h-6 leading-7 bg-blue-100"
                    value={typeof content === "string" ? content : ""}
                    onChange={handleContentChange}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    rows={1}
                />
            ) : (
                <div
                    className="w-full bg-white h-full prose min-h-6 min-w-full overflow-wrap-normal break-words whitespace-normal overflow-x-hidden"
                    onClick={handleClickBlock}
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
    );
};
