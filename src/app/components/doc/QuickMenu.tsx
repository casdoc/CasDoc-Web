import React from "react";
import { BlockType } from "../../types";

interface QuickMenuProps {
    blockId: string;
    switchToComponent: (
        blockId: string,
        componentName: string,
        props: Record<string, any>
    ) => void;
    onClose: () => void;
}

const availableComponents = ["image", "table"];

export default function QuickMenu({
    blockId,
    switchToComponent,
    onClose,
}: QuickMenuProps) {
    const handleSelect = (componentName: string) => {
        switchToComponent(blockId, componentName, {});
        onClose();
    };

    return (
        <div className="absolute bg-white border rounded shadow p-2">
            {availableComponents.map((comp) => (
                <button
                    key={comp}
                    onClick={() => handleSelect(comp)}
                    className="block w-full text-left p-1 hover:bg-gray-200"
                >
                    {comp}
                </button>
            ))}
        </div>
    );
}
