import { NodeViewWrapper } from "@tiptap/react";
import { NodeViewProps } from "@tiptap/core";
import { useNodeSelection } from "@/app/viewModels/context/NodeSelectionContext";
import { useState, useEffect } from "react";
import NodeBubbleBar from "@/app/components/doc/Popover/NodeBubbleBar";
import useCustomNodeActions from "../../../extensions/hooks/useCustomNodeActions";
import { Collapsible } from "@/components/ui/collapsible";
import UserStoryUI from "./UserStoryUI";
import { UserStoryEntity, AcceptanceCriteria } from "./entity/UserStoryEntity";

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

    const entity = new UserStoryEntity(
        config?.info?.name,
        config?.info?.serial,
        config?.info?.tag,
        config?.info?.priority,
        config?.info?.role,
        config?.info?.feature,
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
        const updatedFields = entity.fields.map(
            (field: AcceptanceCriteria) => ({
                ...field,
                done: entity.isTaskDone(field.done) ? "false" : "true",
            })
        );

        updateAttributes({
            config: {
                ...config,
                fields: updatedFields,
            },
        });
    };

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
                <UserStoryUI entity={entity} toggleCheckbox={toggleCheckbox} />
            </Collapsible>
        </NodeViewWrapper>
    );
};

export default UserStoryComponent;
