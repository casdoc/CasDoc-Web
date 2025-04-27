import { NodeViewWrapper } from "@tiptap/react";
import { NodeViewProps } from "@tiptap/core";
import { useNodeSelection } from "@/app/viewModels/context/NodeSelectionContext";
import { useState, useEffect } from "react";
import NodeBubbleBar from "@/app/components/doc/Popover/NodeBubbleBar";
import useCustomNodeActions from "../../../extensions/hooks/useCustomNodeActions";

const WhiteBoardComponent = ({
    node,
    selected,
    editor,
    getPos,
}: NodeViewProps) => {
    const { id, config } = node.attrs;
    const { selectedNode } = useNodeSelection();
    const isEditing = selectedNode === id;
    const info = config?.info || {};
    const [showBubbleBar, setShowBubbleBar] = useState(false);
    const { setNodeRef } = useCustomNodeActions({
        id,
        selected,
        getPos,
        editor,
    });

    useEffect(() => {
        if (!selected && showBubbleBar) {
            setShowBubbleBar(false);
        }
    }, [selected, showBubbleBar]);

    const handleClick = (e: React.MouseEvent): void => {
        if (window.getSelection()?.toString()) return;
        setShowBubbleBar(!showBubbleBar);
        e.stopPropagation();
    };

    return (
        <NodeViewWrapper
            className={`ml-8 group cursor-pointer hover:bg-gray-50 border-2 relative bg-white ${
                isEditing
                    ? "border-blue-500 rounded-lg"
                    : selected
                    ? "border-gray-500 rounded-lg"
                    : "border-gray-100 hover:border-opacity-50 rounded-none"
            } shadow-lg`}
            onClick={handleClick}
            ref={setNodeRef}
        >
            <NodeBubbleBar
                id={id}
                selected={showBubbleBar}
                getPos={getPos}
                editor={editor}
            />
            <div className="px-4 py-6">
                <h3>{info.name}</h3>
                <span className="text-sm text-gray-700 mt-1 mb-4 group-hover:cursor-text">
                    {info.description}
                </span>
            </div>
        </NodeViewWrapper>
    );
};

export default WhiteBoardComponent;
