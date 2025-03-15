import React from "react";
import { NodeViewWrapper } from "@tiptap/react";
import { NodeViewProps } from "@tiptap/core";
import { useNodeSelection } from "@/app/viewModels/context/NodeSelectionContext";

export const TopicComponent: React.FC<NodeViewProps> = ({ node, selected }) => {
    const { id, name } = node.attrs;
    const { selectedNode, selectNode } = useNodeSelection();
    const isSelected = selectedNode === id;

    const handleClick = () => {
        selectNode(isSelected ? null : id);
    };

    return (
        <NodeViewWrapper
            className={`cursor-pointer hover:bg-gray-50 p-6 border-2 rounded-lg shadow-md  bg-white ${
                isSelected && "border-indigo-500"
            } ${!isSelected && selected && "border-gray-500"}
            `}
            onClick={handleClick}
        >
            <div className=" border-l-4 border-indigo-500 pl-4">
                <h2 className="text-2xl font-bold text-indigo-700">
                    {name || "Topic Name"}
                </h2>
            </div>
        </NodeViewWrapper>
    );
};
