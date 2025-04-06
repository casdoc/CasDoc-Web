import React, { useState, useEffect } from "react";
import { NodeViewWrapper } from "@tiptap/react";
import { NodeViewProps } from "@tiptap/core";
import { useNodeSelection } from "@/app/viewModels/context/NodeSelectionContext";
import NodeBubbleBar from "@/app/components/doc/Popover/NodeBubbleBar";
const TopicComponent = ({ node, selected, editor, getPos }: NodeViewProps) => {
    const { id, config } = node.attrs;
    const { selectedNode } = useNodeSelection();
    const isEditing = selectedNode === id;

    const [showBubbleBar, setShowBubbleBar] = useState(false);

    // Reset bubble bar when component loses selection
    useEffect(() => {
        if (!selected && showBubbleBar) {
            setShowBubbleBar(false);
        }
    }, [selected, showBubbleBar]);

    const handleClick = (e: React.MouseEvent): void => {
        // Don't toggle if text is selected
        if (window.getSelection()?.toString()) {
            return;
        }
        // Toggle the bubble bar visibility
        setShowBubbleBar(!showBubbleBar);
        // Prevent event from propagating to parent elements
        e.stopPropagation();
    };
    return (
        <NodeViewWrapper
            className={`cursor-pointer group hover:bg-gray-50 rounded-lg border-2 px-1 py-2 bg-white relative  ${
                isEditing
                    ? "border-blue-500"
                    : selected
                    ? "border-gray-500 "
                    : "border-white hover:border-gray-200"
            } `}
            onClick={handleClick}
        >
            <NodeBubbleBar
                id={id}
                selected={showBubbleBar}
                getPos={getPos}
                editor={editor}
            />

            <div className="border-l-4 border-slate-400 pl-3">
                <h2 className="text-2xl font-bold text-black m-0 px-0 pb-1 group-hover:cursor-text w-fit">
                    {config.info.name || "Unknown"}
                </h2>
                <p className="m-0 p-0 text-sm text-gray-500 font-semibold group-hover:cursor-text w-fit">
                    {config.info.description}
                </p>
            </div>
        </NodeViewWrapper>
    );
};

export default TopicComponent;
