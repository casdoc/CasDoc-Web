import React, { useState, useRef, useEffect } from "react";
import { useEditorStore } from "../../store/editorStore";

interface BlockMenuProps {
    blockId: string;
}

const COMPONENT_TYPES = [
    { name: "Heading 1", value: "h1" },
    { name: "Heading 2", value: "h2" },
    { name: "Heading 3", value: "h3" },
    { name: "Callout", value: "callout" },
    { name: "Divider", value: "divider" },
    { name: "Code Block", value: "code" },
    { name: "Image", value: "image" },
];

export const BlockMenu: React.FC<BlockMenuProps> = ({ blockId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const convertBlockToComponent = useEditorStore(
        (state) => state.convertBlockToComponent
    );
    const deleteBlock = useEditorStore((state) => state.deleteBlock);
    const moveBlockUp = useEditorStore((state) => state.moveBlockUp);
    const moveBlockDown = useEditorStore((state) => state.moveBlockDown);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSelectComponent = (component: string) => {
        convertBlockToComponent(blockId, component);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                className="w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-200"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-gray-500">+</span>
            </button>

            {isOpen && (
                <div className="absolute left-8 top-0 z-10 bg-white shadow-md rounded-md p-2 w-48">
                    <div className="text-sm font-medium text-gray-700 mb-2">
                        基本操作
                    </div>
                    <div className="grid grid-cols-1 gap-1">
                        <button
                            className="text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                            onClick={() => moveBlockUp(blockId)}
                        >
                            向上移动
                        </button>
                        <button
                            className="text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                            onClick={() => moveBlockDown(blockId)}
                        >
                            向下移动
                        </button>
                        <button
                            className="text-left px-2 py-1 hover:bg-gray-100 rounded text-sm text-red-500"
                            onClick={() => deleteBlock(blockId)}
                        >
                            删除区块
                        </button>
                    </div>

                    <div className="border-t my-2"></div>
                    <div className="text-sm font-medium text-gray-700 mb-2">
                        转换为
                    </div>

                    <div className="grid grid-cols-1 gap-1">
                        {COMPONENT_TYPES.map((component) => (
                            <button
                                key={component.value}
                                className="text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                onClick={() =>
                                    handleSelectComponent(component.value)
                                }
                            >
                                {component.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
