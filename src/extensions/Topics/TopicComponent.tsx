import React, { useState } from "react";
import { NodeViewWrapper } from "@tiptap/react";
import { NodeViewProps } from "@tiptap/core";
import { useNodeSelection } from "@/app/viewModels/context/NodeSelectionContext";
import NodeBubbleBar from "@/app/components/doc/Popover/NodeBubbleBar";

const TopicComponent: React.FC<NodeViewProps> = ({
    node,
    selected,
    editor,
    getPos,
}) => {
    const { id, config } = node.attrs;
    const { selectedNode, selectNode } = useNodeSelection();
    const isSelected = selectedNode === id;
    const [bubbleOpen, setBubbleOpen] = useState(false);

    const handleClick = (): void => {
        setBubbleOpen(!bubbleOpen);
    };

    const handleCopy = () => {
        if (typeof getPos === "function") {
            const pos = getPos();
            editor.commands.setNodeSelection(pos);

            const event = new CustomEvent("node-copy", {
                detail: { pos },
            });
            window.dispatchEvent(event);
        }
    };

    const handleDelete = () => {
        if (typeof getPos === "function") {
            const pos = getPos();

            const event = new CustomEvent("node-delete", {
                detail: { id, pos },
            });
            window.dispatchEvent(event);
        }
    };

    const handleEdit = () => {
        selectNode(id);
    };

    return (
        <NodeViewWrapper
            className={`cursor-pointer hover:bg-gray-50 rounded-lg border-2 pl-1 py-2 bg-white relative select-none ${
                isSelected
                    ? "border-blue-500"
                    : selected
                    ? "border-gray-500"
                    : "border-white hover:border-gray-200"
            }
            `}
            onClick={handleClick}
        >
            <NodeBubbleBar
                open={bubbleOpen}
                onOpenChange={setBubbleOpen}
                onCopy={handleCopy}
                onDelete={handleDelete}
                onEdit={handleEdit}
            />

            <div className="border-l-4 border-slate-400 pl-3 select-none">
                <h2 className="text-2xl font-bold text-black m-0 px-0 pb-1 select-none">
                    {config.info.name || "Unknown"}
                </h2>
                <p className="m-0 p-0 text-sm text-gray-500 font-semibold select-none">
                    {config.info.description}
                </p>
            </div>
        </NodeViewWrapper>
    );
};

export default TopicComponent;
