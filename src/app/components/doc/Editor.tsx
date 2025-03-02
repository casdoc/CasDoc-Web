"use client";

import React, { useEffect, useRef } from "react";
import { BlockView } from "@/app/components/editorPanel/BlockView";
import { BlockViewModel } from "@/app/viewModels/BlockViewModel";
import Toolbar from "./ToolBar";

export interface EditorViewProps {
    blockViewModel: BlockViewModel;
}

const Editor = ({ blockViewModel }: EditorViewProps) => {
    const { blocks, addBlock } = blockViewModel;
    const lastBlockRef = useRef<HTMLDivElement>(null);
    console.debug("Editor 刷新", blocks);

    useEffect(() => {
        if (!blocks.length) {
            addBlock(-1, "md", "");
        }
    }, []);

    const lastContent =
        blocks.length > 0 ? blocks[blocks.length - 1].content : "";
    const shouldShowPlaceholder =
        blocks.length === 0 ||
        (typeof lastContent === "string" && lastContent.trim() !== "");

    return (
        <div className="max-w-4xl min-h-screen bg-white rounded-lg shadow-xl py-10 px-6">
            <div ref={lastBlockRef}>
                {blocks.map((_, _index) => (
                    <BlockView
                        key={_index}
                        index={_index}
                        blockViewModel={blockViewModel}
                    />
                ))}
            </div>
            {shouldShowPlaceholder && (
                <div
                    className="text-slate-600 opacity-50 cursor-pointer mt-4"
                    onClick={() => addBlock(blocks.length, "md", "")}
                >
                    click me (or press Enter)
                </div>
            )}
            <div className="fixed bottom-8">
                <Toolbar onApplyFormat={(tmp) => tmp} />
            </div>
        </div>
    );
};

export default Editor;
