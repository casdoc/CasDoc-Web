import React, { useState, useRef, useEffect } from "react";
import { NodeViewWrapper } from "@tiptap/react";
import { NodeViewProps } from "@tiptap/core";
import { useNodeSelection } from "@/app/viewModels/context/NodeSelectionContext";
import NodeBubbleBar from "@/app/components/doc/Popover/NodeBubbleBar";
import useCustomNodeActions from "@/extensions/hooks/useCustomNodeActions";

const TopicComponent = ({ node, selected, editor, getPos }: NodeViewProps) => {
    const { id, config } = node.attrs;
    const { selectedNode } = useNodeSelection();
    const isSelected = selectedNode === id;
    const [bubbleOpen, setBubbleOpen] = useState(false);
    const nodeRef = useRef<HTMLDivElement>(null);

    const { handleEdit, handleCopy, handleDelete, setNodeRef } =
        useCustomNodeActions({
            id,
            selected,
            getPos,
            editor,
        });

    // Set the node ref when component mounts
    useEffect(() => {
        if (nodeRef.current) {
            setNodeRef(nodeRef.current);
        }
    }, [setNodeRef, nodeRef]);

    // When selected, ensure the node can receive focus
    useEffect(() => {
        if (selected && nodeRef.current) {
            // Make sure the node is focusable
            nodeRef.current.setAttribute("tabindex", "0");
            // Focus the node when selected
            nodeRef.current.focus();
        }
    }, [selected]);

    const handleClick = (): void => {
        if (window.getSelection()?.toString()) {
            return;
        }
        setBubbleOpen(!bubbleOpen);
    };

    return (
        <NodeViewWrapper
            className={`cursor-pointer group hover:bg-gray-50 rounded-lg border-2 px-1 py-2 bg-white relative  ${
                isSelected
                    ? "border-blue-500"
                    : selected
                    ? "border-gray-500 "
                    : "border-white hover:border-gray-200"
            } `}
            onClick={handleClick}
        >
            <NodeBubbleBar
                open={bubbleOpen}
                onOpenChange={setBubbleOpen}
                onCopy={handleCopy}
                onDelete={handleDelete}
                onEdit={handleEdit}
                hasAgentAdvice={true}
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
