import React from "react";
import { ComponentBlock } from "../../types";

interface ComponentViewModeProps {
    block: ComponentBlock;
    onStartEditing: () => void;
}

export default function ComponentViewMode({
    block,
    onStartEditing,
}: ComponentViewModeProps) {
    // 這裡需要為每個元件定義檢視介面
    return (
        <div onClick={onStartEditing} className="cursor-pointer">
            Component: {block.componentName}
        </div>
    );
}
