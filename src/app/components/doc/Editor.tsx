"use client";

// import { useRef, useEffect } from "react";

// interface EditorProps {
//     value: string;
//     onChange: (value: string) => void;
// }

// const Editor = ({ value, onChange }: EditorProps) => {
//     const textAreaRef = useRef<HTMLTextAreaElement>(null);

//     useEffect(() => {
//         if (textAreaRef.current) {
//             textAreaRef.current.style.height = "auto";
//             textAreaRef.current.style.height =
//                 textAreaRef.current.scrollHeight + "px";
//         }
//     }, [value]);

//     return (
//         <div className="max-w-full min-h-screen bg-white shadow-xl rounded-lg p-16">
//             <textarea
//                 ref={textAreaRef}
//                 className="w-full min-h-screen outline-none text-lg leading-relaxed bg-transparent resize-none overflow-hidden"
//                 style={{ whiteSpace: "pre-wrap" }}
//                 placeholder="週休七日..."
//                 value={value}
//                 onChange={(e) => onChange(e.target.value)}
//             />
//         </div>
//     );
// };

// export default Editor;

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import BlockComponent from "./Block";
import { Block, MarkdownBlockType } from "../../types";

export default function Editor() {
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [editingBlockId, setEditingBlockId] = useState<string | null>(null);

    const addBlock = (
        type: BlockType,
        content?: string,
        componentName?: string,
        props?: Record<string, any>
    ) => {
        const newBlock: Block = { id: uuidv4(), type };
        if (type === "component") {
            newBlock.componentName = componentName!;
            newBlock.props = props || {};
        } else {
            newBlock.content = content || "";
        }
        setBlocks([...blocks, newBlock]);
    };

    const addNewBlockAfterCurrent = (
        type: BlockType,
        content?: string,
        componentName?: string,
        props?: Record<string, any>
    ) => {
        const currentIndex = blocks.findIndex((b) => b.id === editingBlockId);
        if (currentIndex !== -1) {
            const newBlock = {
                id: uuidv4(),
                type,
                content,
                componentName,
                props,
            };
            setBlocks([
                ...blocks.slice(0, currentIndex + 1),
                newBlock,
                ...blocks.slice(currentIndex + 1),
            ]);
            setEditingBlockId(newBlock.id);
        }
    };

    const switchToComponent = (
        blockId: string,
        componentName: string,
        props: Record<string, any>
    ) => {
        setBlocks(
            blocks.map((block) =>
                block.id === blockId
                    ? { ...block, type: "component", componentName, props }
                    : block
            )
        );
    };

    const startEditing = (blockId: string) => setEditingBlockId(blockId);
    const stopEditing = () => setEditingBlockId(null);

    useEffect(() => {
        if (blocks.length === 0) addBlock("paragraph");
    }, [blocks]);

    return (
        <div className="p-4">
            {blocks.map((block) => (
                <BlockComponent
                    key={block.id}
                    block={block}
                    isEditing={block.id === editingBlockId}
                    onStartEditing={startEditing}
                    onStopEditing={stopEditing}
                    addNewBlockAfterCurrent={addNewBlockAfterCurrent}
                    switchToComponent={switchToComponent}
                />
            ))}
        </div>
    );
}
