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
    const { id, type, content, cursorPos, isSelected, isOnFocus } =
        blocks[index];
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
        if (isOnFocus && textareaRef.current) {
            const ref = textareaRef.current as HTMLTextAreaElement;
            ref.style.height = "auto";
            ref.style.height = ref.scrollHeight + "px";
            ref.focus();
            if (cursorPos !== undefined) {
                if (cursorPos === Infinity) {
                    ref.setSelectionRange(ref.value.length, ref.value.length);
                } else {
                    ref.setSelectionRange(cursorPos, cursorPos);
                }
            } else {
                textareaRef.current.setSelectionRange(
                    ref.value.length,
                    ref.value.length
                );
            }
        }
    }, [blocks, index, isOnFocus, cursorPos]);

    const handleClickBlock = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        e.stopPropagation();
        setIsOnFocus(id, true, Infinity);
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateBlockContent(id, e.target.value, e.target.selectionStart);
    };
    const getCursorLine = (textarea: HTMLTextAreaElement) => {
        const textBeforeCursor = textarea.value.slice(
            0,
            textarea.selectionStart
        );
        const lines = textBeforeCursor.split("\n");
        return lines.length;
    };
    const handleKeyDown = (e: React.KeyboardEvent) => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        const currentCursorPos = textarea.selectionStart;
        const contentLength = textarea.value.length;

        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            const beforeContent = textarea.value.slice(0, currentCursorPos);
            const afterContent = textarea.value.slice(currentCursorPos);
            addBlock(index, afterContent, "md", "");
            updateBlockContent(id, beforeContent, undefined);
            setIsOnFocus(id + 1, true, 0);
        } else if (e.key === "Escape") {
            handleBlur();
        } else if (e.key === "ArrowUp") {
            const cursorLine = getCursorLine(textarea);
            if (cursorLine === 1) {
                e.preventDefault();
                if (index > 0) {
                    const prevBlockContent = blocks[index - 1]
                        .content as string;
                    const totalLines = prevBlockContent.split("\n");
                    const lastLine = totalLines[totalLines.length - 1];
                    const pos =
                        lastLine.length > currentCursorPos
                            ? prevBlockContent.length -
                              (lastLine.length - currentCursorPos)
                            : prevBlockContent.length;
                    setIsOnFocus(id, false);
                    setIsOnFocus(blocks[index - 1].id, true, pos);
                }
            }
        } else if (e.key === "ArrowDown") {
            const cursorLine = getCursorLine(textarea);
            const totalLines = textarea.value.split("\n");
            if (cursorLine === totalLines.length) {
                e.preventDefault();
                console.debug(
                    "contentLength - currentCursorPos",
                    contentLength - currentCursorPos
                );
                if (index < blocks.length - 1) {
                    const nextBlockContent = blocks[index + 1]
                        .content as string;
                    const nextBlockLines = nextBlockContent.split("\n");
                    const cursorLinePos =
                        totalLines[totalLines.length - 1].length -
                        (contentLength - currentCursorPos);
                    const pos =
                        nextBlockLines[0].length > cursorLinePos
                            ? cursorLinePos
                            : nextBlockLines[0].length;
                    setIsOnFocus(id, false);
                    setIsOnFocus(blocks[index + 1].id, true, pos);
                }
            }
        } else if (e.key === "ArrowLeft" && currentCursorPos === 0) {
            e.preventDefault();
            if (index > 0) {
                setIsOnFocus(id, false);
                setIsOnFocus(blocks[index - 1].id, true, Infinity);
            }
        } else if (
            e.key === "ArrowRight" &&
            currentCursorPos === contentLength
        ) {
            e.preventDefault();
            if (index < blocks.length - 1) {
                setIsOnFocus(id, false);
                setIsOnFocus(blocks[index + 1].id, true, 0);
            }
        } else if (e.key === "Backspace" && currentCursorPos === 0) {
            e.preventDefault();
            if (index > 0) {
                handleDeleteBlock(index, "backspace");
            }
        } else if (e.key === "Delete" && currentCursorPos === contentLength) {
            e.preventDefault();
            if (index < blocks.length - 1) {
                handleDeleteBlock(index, "delete");
            }
        }
    };

    const handleDeleteBlock = (
        index: number,
        action: "backspace" | "delete"
    ) => {
        if (action === "backspace") {
            const prevBlock = blocks[index - 1];
            if (prevBlock.type === "md") {
                const deleteContent = blocks[index].content as string;
                const prevContent = prevBlock.content as string;
                const mergedContent = prevContent + deleteContent;
                const prevContentLength = prevContent.length;
                deleteBlock(id);
                updateBlockContent(prevBlock.id, mergedContent);
                setIsOnFocus(prevBlock.id, true, prevContentLength);
            }
        } else if (action === "delete") {
            const nextBlock = blocks[index + 1];
            if (nextBlock.type === "md") {
                const currentContent = blocks[index].content as string;
                const nextContent = nextBlock.content as string;
                const mergedContent = currentContent + nextContent;
                const currentContentLength = currentContent.length;
                deleteBlock(nextBlock.id);
                updateBlockContent(id, mergedContent);
                setIsOnFocus(id, true, currentContentLength);
            }
        }
    };

    const handleBlur = () => {
        setIsOnFocus(id, false);
    };

    return (
        <div
            className={`group flex flex-row min-h-6 items-stretch justify-stretch ${
                isOnFocus ? "bg-blue-300" : "bg-white-400"
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
                    className="w-full bg-white h-full prose min-h-6 min-w-full overflow-wrap-normal break-words whitespace-normal overflow-x-hidden hover:cursor-text"
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
