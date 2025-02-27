import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { useEditorStore } from "../../store/editorStore";
import { Block as BlockType } from "../../types/editor";
import { BlockMenu } from "./BlockMenu";
import { ComponentRenderer } from "./ComponentRenderer";

interface BlockProps {
    block: BlockType;
    isLast: boolean;
}

export const Block: React.FC<BlockProps> = ({ block, isLast }) => {
    const { id, type, content, component } = block;
    const editingBlockId = useEditorStore((state) => state.editingBlockId);
    const activeBlockId = useEditorStore((state) => state.activeBlockId);
    const setActiveBlock = useEditorStore((state) => state.setActiveBlock);
    const setEditingBlock = useEditorStore((state) => state.setEditingBlock);
    const updateBlockContent = useEditorStore(
        (state) => state.updateBlockContent
    );
    const handleEnterKey = useEditorStore((state) => state.handleEnterKey);
    const handleEscapeKey = useEditorStore((state) => state.handleEscapeKey);

    const isEditing = editingBlockId === id;
    const isActive = activeBlockId === id;
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // 自动调整textarea高度
    useEffect(() => {
        if (isEditing && textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height =
                textareaRef.current.scrollHeight + "px";
            textareaRef.current.focus();
        }
    }, [isEditing, content]);

    // 如果是最后一个区块并且是新创建的，自动进入编辑模式
    useEffect(() => {
        if (isLast && content === "" && !isEditing) {
            setEditingBlock(id);
        }
    }, [isLast, content, id, isEditing, setEditingBlock]);

    const handleClick = () => {
        setActiveBlock(id);
    };

    const handleDoubleClick = () => {
        setEditingBlock(id);
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateBlockContent(id, e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleEnterKey(id);
        } else if (e.key === "Escape") {
            handleEscapeKey();
        }
    };

    return (
        <div
            className={`group flex items-start p-1 rounded-md hover:bg-gray-50 ${
                isActive ? "bg-gray-50" : ""
            }`}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
        >
            <div className="flex-shrink-0 w-8 pt-1">
                <BlockMenu blockId={id} />
            </div>

            <div className="flex-grow">
                {isEditing ? (
                    <textarea
                        ref={textareaRef}
                        className="w-full resize-none border-none focus:outline-none bg-transparent p-1"
                        value={content}
                        onChange={handleContentChange}
                        onKeyDown={handleKeyDown}
                        placeholder="输入内容..."
                        rows={1}
                    />
                ) : (
                    <div className="p-1">
                        {type === "markdown" ? (
                            <div className="prose prose-sm max-w-none">
                                {content ? (
                                    <ReactMarkdown>{content}</ReactMarkdown>
                                ) : (
                                    <p className="text-gray-400">输入内容...</p>
                                )}
                            </div>
                        ) : (
                            <ComponentRenderer
                                type={component!}
                                content={content}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
