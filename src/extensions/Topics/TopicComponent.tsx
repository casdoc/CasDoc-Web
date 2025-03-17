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
            className={`cursor-pointer hover:bg-gray-50 rounded-lg border-2 p-4 bg-white ${
                isSelected
                    ? "border-indigo-500"
                    : selected
                    ? "border-gray-500"
                    : "border-white hover:border-gray-200"
            }
            `}
            onClick={handleClick}
        >
            <div className="border-l-4 border-indigo-500 pl-3">
                <h2 className="text-2xl font-bold text-indigo-700">{name}</h2>
            </div>
        </NodeViewWrapper>
    );
};
