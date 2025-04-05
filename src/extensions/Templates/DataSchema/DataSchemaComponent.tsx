import { NodeViewWrapper } from "@tiptap/react";
import { NodeViewProps } from "@tiptap/core";
import { useNodeSelection } from "@/app/viewModels/context/NodeSelectionContext";
import { useState, useRef, useEffect } from "react";
import NodeBubbleBar from "@/app/components/doc/Popover/NodeBubbleBar";
import useCustomNodeActions from "@/extensions/hooks/useCustomNodeActions";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

export interface DataSchemaField {
    name: string;
    type: string;
    description: string;
}

const DataSchemaComponent = ({
    node,
    selected,
    editor,
    getPos,
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

    return (
        <NodeViewWrapper
            className={`ml-8 group cursor-pointer hover:bg-gray-50 rounded-lg border-2 relative bg-white ${
                isSelected
                    ? "border-blue-500"
                    : selected
                    ? "border-gray-500 "
                    : "border-white hover:border-gray-200"
            } `}
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
                <CollapsibleTrigger className="w-full h-full pt-2 pl-4 border-b rounded-sm group/chevron">
                    <div className="flex justify-between">
                        <div className="flex items-center gap-1">
                            <h2 className="text-xl font-bold text-black group-hover:cursor-text">
                                {info.name || "Schema Name"}
                            </h2>
                            <ChevronDown className="w-4 h-4 opacity-0 group-hover/chevron:opacity-100 transition-all duration-200 group-data-[state=open]/chevron:rotate-180" />
                        </div>
                        <div className="flex items-center mt-1 mr-3">
                            <span className="px-2 py-1 text-xs bg-gray-100 rounded-md text-gray-700 group-hover:cursor-text">
                                {info.type || "Schema Type"}
                            </span>
                        </div>
                    </div>
                    <p className="mt-0 text-sm text-gray-600 group-hover:cursor-text w-fit">
                        {info.description || "Schema Description"}
                    </p>
                </CollapsibleTrigger>
                <CollapsibleContent className="ml-8 overflow-hidden">
                    {fields && fields.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {fields.map(
                                (field: DataSchemaField, index: number) => {
                                    if (
                                        field.name.trim() === "" &&
                                        field.type.trim() === "" &&
                                        field.description.trim() === ""
                                    ) {
                                        return;
                                    }
                                    return (
                                        <div key={index} className="py-2 px-4">
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium text-gray-800 group-hover:cursor-text">
                                                    {field.name}
                                                </span>
                                                {field.type && (
                                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 group-hover:cursor-text">
                                                        {field.type}
                                                    </span>
                                                )}
                                            </div>
                                            {field.description && (
                                                <p className="mt-0 text-sm text-gray-500 group-hover:cursor-text w-fit">
                                                    {field.description}
                                                </p>
                                            )}
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    ) : (
                        <div className="p-4 text-center text-gray-400">
                            No fields yet
                        </div>
                    )}
                </CollapsibleContent>
            </Collapsible>
        </NodeViewWrapper>
    );
};

export default DataSchemaComponent;
