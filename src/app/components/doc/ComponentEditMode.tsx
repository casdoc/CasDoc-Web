import React from "react";
import { ComponentBlock } from "../../types";

interface ComponentEditModeProps {
    block: ComponentBlock;
    onUpdateBlock: (updatedBlock: ComponentBlock) => void;
    onStopEditing: () => void;
}

export default function ComponentEditMode({
    block,
    onUpdateBlock,
    onStopEditing,
}: ComponentEditModeProps) {
    // 這裡需要為每個元件定義編輯介面，例如圖片輸入 URL 和替代文字
    return (
        <div>
            <input placeholder="Component editing interface" />
            <button onClick={onStopEditing}>保存</button>
        </div>
    );
}
