"use client";

import React, { useEffect, useRef } from "react";
import { BlockView } from "@/app/components/editorPanel/BlockView";
import { EditorViewModel } from "@/app/viewModels/editor/EditorViewModel";
import Toolbar from "./ToolBar";

export interface EditorViewProps {
    editorViewModel: EditorViewModel;
}

const Editor = ({ editorViewModel }: EditorViewProps) => {
    const { blocks, addBlock } = editorViewModel;
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
        <div className="max-w-4xl">
            <div ref={lastBlockRef}>
                {blocks.map((_, _index) => (
                    <BlockView
                        key={_index}
                        index={_index}
                        editorViewModel={editorViewModel}
                    />
                ))}
            </div>
            {shouldShowPlaceholder && (
                <div
                    className="opacity-50 cursor-pointer mt-4"
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
