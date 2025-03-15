import React, { useEffect, useState } from "react";
import { NodeViewWrapper } from "@tiptap/react";
import { NodeViewProps } from "@tiptap/core";
import { useNodeSelection } from "@/app/viewModels/context/NodeSelectionContext";
import { useDocContext } from "@/app/viewModels/context/DocContext";

export const TopicComponent: React.FC<NodeViewProps> = ({ node, selected }) => {
    const { id, name: initialName } = node.attrs;
    const { selectedNode, selectNode } = useNodeSelection();
    const { document } = useDocContext();
    const isSelected = selectedNode === id;
    const [name, setName] = useState(initialName || "Untitled Topic");

    // Sync from node attributes to state
    useEffect(() => {
        if (initialName !== undefined) {
            setName(initialName);
        }
    }, [initialName]);

    // Sync from viewModel to state
    useEffect(() => {
        console.debug("document", document);
        if (!document) return;
        const topicData = document.getTopicById(id);
        console.debug("topicData", topicData);
        if (topicData && topicData.name !== name) {
            setName(topicData.name);
        }
    }, [document, id, name]);

    const handleClick = () => {
        selectNode(isSelected ? null : id);
    };

    return (
        <NodeViewWrapper
            className={`p-4 border-2 rounded-lg shadow-md bg-white ${
                isSelected && "border-indigo-500"
            } ${!isSelected && selected && "border-gray-500"}
            `}
            onClick={handleClick}
        >
            <div className="mb-6 border-l-4 border-indigo-500 pl-4">
                <h2 className="text-2xl font-bold text-indigo-700">{name}</h2>
            </div>
        </NodeViewWrapper>
    );
};
