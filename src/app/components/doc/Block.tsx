import React, { useState } from "react";
import MarkdownEditMode from "./MarkdownEditMode";
import MarkdownViewMode from "./MarkdownViewMode";
import ComponentEditMode from "./ComponentEditMode";
import ComponentViewMode from "./ComponentViewMode";
import QuickMenu from "./QuickMenu";
import { Block } from "../../types";

interface BlockComponentProps {
    block: Block;
    isEditing: boolean;
    onStartEditing: (blockId: string) => void;
    onStopEditing: () => void;
    addNewBlockAfterCurrent: (
        type: BlockType,
        content?: string,
        componentName?: string,
        props?: Record<string, any>
    ) => void;
    switchToComponent: (
        blockId: string,
        componentName: string,
        props: Record<string, any>
    ) => void;
}

export default function BlockComponent({
    block,
    isEditing,
    onStartEditing,
    onStopEditing,
    addNewBlockAfterCurrent,
    switchToComponent,
}: BlockComponentProps) {
    const [showQuickMenu, setShowQuickMenu] = useState(false);

    const handleEdit = () => onStartEditing(block.id);
    const toggleQuickMenu = () => setShowQuickMenu(!showQuickMenu);

    let content;
    if (block.type !== "component") {
        const markdownBlock = block as MarkdownBlock;
        content = isEditing ? (
            <MarkdownEditMode
                block={markdownBlock}
                onUpdateBlock={(updated) =>
                    console.log("Update block:", updated)
                }
                onStopEditing={onStopEditing}
                addNewBlockAfterCurrent={addNewBlockAfterCurrent}
            />
        ) : (
            <MarkdownViewMode
                block={markdownBlock}
                onStartEditing={handleEdit}
            />
        );
    } else {
        const componentBlock = block as ComponentBlock;
        content = isEditing ? (
            <ComponentEditMode
                block={componentBlock}
                onUpdateBlock={(updated) =>
                    console.log("Update component:", updated)
                }
                onStopEditing={onStopEditing}
            />
        ) : (
            <ComponentViewMode
                block={componentBlock}
                onStartEditing={handleEdit}
            />
        );
    }

    return (
        <div className="mb-4 p-2 border rounded">
            {content}
            {!isEditing && (
                <button
                    onClick={handleEdit}
                    className="bg-blue-500 text-white p-1 rounded"
                >
                    編輯
                </button>
            )}
            {isEditing && (
                <button
                    onClick={onStopEditing}
                    className="bg-green-500 text-white p-1 rounded"
                >
                    保存
                </button>
            )}
            <button
                onClick={toggleQuickMenu}
                className="bg-gray-500 text-white p-1 rounded"
            >
                切換至元件
            </button>
            {showQuickMenu && (
                <QuickMenu
                    blockId={block.id}
                    switchToComponent={switchToComponent}
                    onClose={() => setShowQuickMenu(false)}
                />
            )}
        </div>
    );
}
