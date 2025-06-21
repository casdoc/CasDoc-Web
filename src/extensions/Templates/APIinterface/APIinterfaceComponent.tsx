import { NodeViewWrapper } from "@tiptap/react";
import { NodeViewProps } from "@tiptap/core";
import { useNodeSelection } from "@/app/viewModels/context/NodeSelectionContext";
import { useState, useEffect } from "react";
import NodeBubbleBar from "@/app/components/doc/Popover/NodeBubbleBar";
import useCustomNodeActions from "../../../extensions/hooks/useCustomNodeActions";
import { Collapsible } from "@/components/ui/collapsible";
import APIinterfaceUI from "./APIinterfaceUI";
import { APIinterfaceEntity } from "./entity/APIinterfaceEntity";

const APIinterfaceComponent = ({
    node,
    selected,
    editor,
    getPos,
}: NodeViewProps) => {
    const { id, config } = node.attrs;
    const { selectedNode } = useNodeSelection();
    const isEditing = selectedNode === id;

    const entity = new APIinterfaceEntity(
        config?.info?.method,
        config?.info?.name,
        config?.info?.description,
        config?.info?.endPoint,
        config?.fields,
        config?.fieldKey
    );

    const [showBubbleBar, setShowBubbleBar] = useState(false);
    const { setNodeRef } = useCustomNodeActions({
        id,
        selected,
        getPos,
        editor,
    });

    // Reset bubble bar when component loses selection
    useEffect(() => {
        if (!selected && showBubbleBar) {
            setShowBubbleBar(false);
        }
    }, [selected, showBubbleBar]);

    const handleClick = (e: React.MouseEvent): void => {
        e.stopPropagation();
        // Don't toggle if text is selected
        if (window.getSelection()?.toString()) {
            return;
        }
        // Toggle the bubble bar visibility
        setShowBubbleBar(!showBubbleBar);
        // Prevent event from propagating to parent elements
    };

    return (
        <NodeViewWrapper
            className={`ml-8 group cursor-pointer hover:bg-gray-50 rounded-lg pt-2 border-2 relative bg-white ${
                isEditing
                    ? "border-blue-500"
                    : selected
                    ? "border-gray-500 "
                    : "border-white hover:border-gray-200"
            } `}
            onClick={handleClick}
            ref={setNodeRef}
        >
            <Collapsible defaultOpen={true}>
                <NodeBubbleBar
                    id={id}
                    selected={showBubbleBar}
                    getPos={getPos}
                    editor={editor}
                />
                <APIinterfaceUI entity={entity} />
            </Collapsible>
        </NodeViewWrapper>
    );
};

export default APIinterfaceComponent;
