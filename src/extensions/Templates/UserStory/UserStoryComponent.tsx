import { NodeViewWrapper } from "@tiptap/react";
import { NodeViewProps } from "@tiptap/core";
import { useNodeSelection } from "@/app/viewModels/context/NodeSelectionContext";
import { useCallback, useState, useEffect } from "react";
import NodeBubbleBar from "@/app/components/doc/Popover/NodeBubbleBar";
import useCustomNodeActions from "../../../extensions/hooks/useCustomNodeActions";
import { Collapsible } from "@/components/ui/collapsible";
import UserStoryUI from "./UserStoryUI";

interface Field {
    acceptance: string;
    done: string;
}

const UserStoryComponent = ({
    node,
    selected,
    editor,
    getPos,
    updateAttributes,
}: NodeViewProps) => {
    const { id, config } = node.attrs;
    const { selectedNode } = useNodeSelection();
    const isEditing = selectedNode === id;
    const fields = config?.fields || [];
    const info = config?.info || {};
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
        // Don't toggle if text is selected
        if (window.getSelection()?.toString()) {
            return;
        }
        // Toggle the bubble bar visibility
        setShowBubbleBar(!showBubbleBar);
        // Prevent event from propagating to parent elements
        e.stopPropagation();
    };

    const toggleCheckbox = () => {
        const updatedFields = fields.map((field: Field) => ({
            ...field,
            done: isTaskDone(field.done) ? "false" : "true",
        }));

        updateAttributes({
            config: {
                ...config,
                fields: updatedFields,
            },
        });
    };

    const isTaskDone = useCallback((status: string) => {
        if (!status) return false;
        const str = status.trim().toLowerCase();
        return str === "true" || str === "yes" || str === "ok";
    }, []);

    return (
        <NodeViewWrapper
            className={`ml-8 group cursor-pointer hover:bg-gray-50 rounded-lg border-2 relative bg-white ${
                isEditing
                    ? "border-blue-500"
                    : selected
                    ? "border-gray-500 "
                    : "border-white hover:border-gray-200"
            }`}
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
                <UserStoryUI
                    info={info}
                    fields={fields}
                    isTaskDone={isTaskDone}
                    toggleCheckbox={toggleCheckbox}
                />
            </Collapsible>
        </NodeViewWrapper>
    );
};

export default UserStoryComponent;
