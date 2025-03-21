import React from "react";
import { NodeViewWrapper } from "@tiptap/react";
import { NodeViewProps } from "@tiptap/core";
import { useNodeSelection } from "@/app/viewModels/context/NodeSelectionContext";

const TopicComponent: React.FC<NodeViewProps> = ({ node, selected }) => {
    const { id, config } = node.attrs;
    const { selectedNode, selectNode } = useNodeSelection();
    const isSelected = selectedNode === id;

    const handleClick = () => {
        selectNode(isSelected ? null : id);
    };

    return (
        <NodeViewWrapper
            className={`cursor-pointer hover:bg-gray-50 rounded-lg border-2 px-4 py-2 bg-white ${
                isSelected
                    ? "border-blue-500"
                    : selected
                    ? "border-gray-500"
                    : "border-white hover:border-gray-200"
            }
            `}
            onClick={handleClick}
        >
            <div className="border-l-4 border-slate-400 pl-3">
                <h2 className="text-2xl font-bold text-black m-0 px-0 pb-1">
                    {config.info.name || "Unknown"}
                </h2>
                <p className="m-0 p-0 text-sm text-gray-500 font-semibold">
                    {config.info.description}
                </p>
            </div>
        </NodeViewWrapper>
    );
};

export default TopicComponent;
