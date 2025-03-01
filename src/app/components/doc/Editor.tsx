"use client";

import React, { useEffect, useRef } from "react";
import { BlockView } from "@/app/components/editorPanel/BlockView";
import { useEditorViewModel } from "@/app/viewModels/editor/EditorViewModel";

const Editor = () => {
    const {
        blocks,
        addBlock,
        setIsOnFocus,
        updateBlockContent,
        toggleBlockSelection,
    } = useEditorViewModel();
    const lastBlockRef = useRef<HTMLDivElement>(null);
    console.debug("Editor 刷新", blocks);
    useEffect(() => {
        if (!blocks.length) {
            addBlock(-1, "md", "");
            // toggleBlockEditing(0);
        }
        //  else if (blocks.length === 1 && blocks[0].content === "") {
        //     toggleBlockEditing(0);
        // const blockElement = lastBlockRef.current.querySelector(
        //     "[contenteditable=true]"
        // );
        // if (blockElement) {
        //     (blockElement as HTMLElement).focus();
        // }
        // }
    }, [blocks, addBlock, setIsOnFocus]);

    const lastContent =
        blocks.length > 0 ? blocks[blocks.length - 1].content : "";
    const shouldShowPlaceholder =
        blocks.length === 0 ||
        (typeof lastContent === "string" && lastContent.trim() !== "");

    return (
        <div className="max-w-4xl">
            <div ref={lastBlockRef}>
                {blocks.map((block, _index) => (
                    <BlockView
                        key={_index}
                        block={block}
                        updateBlockContent={updateBlockContent}
                        toggleBlockSelection={toggleBlockSelection}
                        setIsOnFocus={setIsOnFocus}
                        addBlock={addBlock}
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
        </div>
    );
};

export default Editor;
