import { NodeViewWrapper } from "@tiptap/react";
import { NodeViewProps } from "@tiptap/core";
import { useNodeSelection } from "@/app/viewModels/context/NodeSelectionContext";
import { useCallback, useState, useRef, useEffect } from "react";
import NodeBubbleBar from "@/app/components/doc/Popover/NodeBubbleBar";
import useCustomNodeActions from "@/extensions/hooks/useCustomNodeActions";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

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
    const isSelected = selectedNode === id;
    const fields = config?.fields || [];
    const info = config?.info || {};
    const [bubbleOpen, setBubbleOpen] = useState(false);
    const nodeRef = useRef<HTMLDivElement>(null);

    const { handleEdit, handleCopy, handleDelete, setNodeRef } =
        useCustomNodeActions({
            id,
            selected,
            getPos,
            editor,
        });

    // Set the node ref when component mounts
    useEffect(() => {
        if (nodeRef.current) {
            setNodeRef(nodeRef.current);
        }
    }, [setNodeRef, nodeRef]);

    // When selected, ensure the node can receive focus
    useEffect(() => {
        if (selected && nodeRef.current) {
            nodeRef.current.setAttribute("tabindex", "0");
            nodeRef.current.focus();
        }
    }, [selected]);

    const handleClick = (): void => {
        if (window.getSelection()?.toString()) {
            return;
        }
        setBubbleOpen(!bubbleOpen);
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
                isSelected
                    ? "border-blue-500"
                    : selected
                    ? "border-gray-500 "
                    : "border-white hover:border-gray-200"
            }`}
            onClick={handleClick}
        >
            <Collapsible>
                <NodeBubbleBar
                    open={bubbleOpen}
                    onOpenChange={setBubbleOpen}
                    onCopy={handleCopy}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                />
                <CollapsibleTrigger className="w-full h-full pt-3 pb-1 px-3 border-b rounded-sm group/chevron">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-medium text-gray-500 mb-1 group-hover:cursor-text w-fit">
                                {info.serial}
                            </p>
                            {/* {info.serial.trim() !== "" && (
                                <div className="group-hover:cursor-text">
                                    <p className="text-xs font-medium text-gray-500 mb-1 group-hover:cursor-text">
                                        {info.serial}
                                    </p>
                                </div>
                            )} */}
                            <div className="flex items-center gap-1 group-hover:cursor-text">
                                <h2 className="text-xl font-bold text-gray-900 mt-0 group-hover:cursor-text">
                                    {info.name || "New Story"}
                                </h2>
                                <ChevronDown className="w-4 h-4 opacity-0 group-hover/chevron:opacity-100 transition-all duration-200 group-data-[state=open]/chevron:rotate-180" />
                            </div>
                            <div className="flex flex-wrap items-center gap-2 my-1">
                                {info.tag.trim() !== "" && (
                                    <div className="group-hover:cursor-text">
                                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded border border-blue-300 group-hover:cursor-text">
                                            {info.tag}
                                        </span>
                                    </div>
                                )}
                                {info.priority.trim() !== "" && (
                                    <div className="group-hover:cursor-text">
                                        <span
                                            className={`text-xs px-2 py-1 rounded font-medium border ${calculatePriorityStyle(
                                                parseInt(info.priority)
                                            )} group-hover:cursor-text`}
                                        >
                                            P{info.priority}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 py-3 space-y-2">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                            Role
                        </h3>
                        <div className="group-hover:cursor-text">
                            <p className="text-sm text-gray-700 mt-1 mb-4 group-hover:cursor-text">
                                {info.role}
                            </p>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                            Feature
                        </h3>
                        <div className="group-hover:cursor-text">
                            <p className="text-sm text-gray-700 mt-1 mb-4 group-hover:cursor-text">
                                {info.feature}
                            </p>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                            Acceptance Criteria
                        </h3>
                        <ul className="divide-y divide-gray-100 mt-1">
                            {fields.map((field: Field, index: number) => (
                                <li
                                    key={index}
                                    className="flex items-start py-2"
                                >
                                    <input
                                        type="checkbox"
                                        checked={isTaskDone(field.done)}
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={toggleCheckbox}
                                        className="mt-1 mr-2"
                                    />
                                    <div className="group-hover:cursor-text">
                                        <span
                                            className={`text-sm ${
                                                isTaskDone(field.done)
                                                    ? "line-through text-gray-400"
                                                    : "text-gray-800"
                                            }`}
                                        >
                                            {field.acceptance}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </NodeViewWrapper>
    );
};

export default UserStoryComponent;
