import React, { useEffect, useState } from "react";
import { NodeViewWrapper } from "@tiptap/react";
import { NodeViewProps } from "@tiptap/core";
import { useNodeSelection } from "@/app/viewModels/context/NodeSelectionContext";
import { useDocContext } from "@/app/viewModels/context/DocContext";

const TopicComponent: React.FC<NodeViewProps> = ({ node, selected }) => {
    const { id, config: initialConfig } = node.attrs;
    const { selectedNode, selectNode } = useNodeSelection();
    const { document } = useDocContext();
    const isSelected = selectedNode === id;
    const [config, setConfig] = useState(initialConfig || "Untitled Topic");

    // Sync from node attributes to state
    useEffect(() => {
        if (initialConfig !== undefined) {
            setConfig(initialConfig);
        }
    }, [initialConfig]);

    // Sync from viewModel to state
    useEffect(() => {
        console.debug("document", document);
        if (!document) return;
        const topicData = document.getTopicById(id);
        console.debug("topicData", topicData);
        if (topicData && topicData.config !== config) {
            setConfig(topicData.config);
        }
    }, [document, id, config]);

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
                    {config.name}
                </h2>
                <p className="m-0 p-0 text-sm text-gray-500 font-semibold">
                    {config.description}
                </p>
            </div>
        </NodeViewWrapper>
    );
};

export default TopicComponent;
