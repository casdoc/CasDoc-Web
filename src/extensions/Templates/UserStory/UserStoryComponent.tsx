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

    const calculatePriorityStyle = useCallback((priority: number) => {
        switch (priority) {
            case 1:
                return "bg-green-100 text-green-800 border-green-300";
            case 2:
                return "bg-yellow-100 text-yellow-800 border-yellow-300";
            case 3:
                return "bg-orange-100 text-orange-800 border-orange-300";
            case 4:
                return "bg-red-100 text-red-800 border-red-300";
            case 5:
                return "bg-purple-100 text-purple-800 border-purple-300";
        }
        return "bg-gray-100 text-gray-800 border-gray-300";
    }, []);

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
                    calculatePriorityStyle={calculatePriorityStyle}
                    isTaskDone={isTaskDone}
                    toggleCheckbox={toggleCheckbox}
                />
            </Collapsible>
        </NodeViewWrapper>
    );
};

export default UserStoryComponent;
