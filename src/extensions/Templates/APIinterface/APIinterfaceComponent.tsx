import { NodeViewWrapper } from "@tiptap/react";
import { NodeViewProps } from "@tiptap/core";
import { useNodeSelection } from "@/app/viewModels/context/NodeSelectionContext";
import { useState, useRef, useEffect } from "react";
import NodeBubbleBar from "@/app/components/doc/Popover/NodeBubbleBar";
import useCustomNodeActions from "@/extensions/hooks/useCustomNodeActions";

export interface APIinterfaceParameter {
    name: string;
    type: string;
    required: boolean;
    description: string;
}

const APIinterfaceComponent = ({
    node,
    selected,
    editor,
    getPos,
}: NodeViewProps) => {
    const { id, config } = node.attrs;
    const info = config?.info || {};
    const fields = config?.fields || [];
    const { selectedNode } = useNodeSelection();
    const isSelected = selectedNode === id;
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

    const getMethodColor = (method?: string): string => {
        switch (method?.trim().toUpperCase()) {
            case "GET":
                return "bg-green-500";
            case "POST":
                return "bg-blue-500";
            case "PUT":
                return "bg-yellow-500";
            case "DELETE":
                return "bg-red-500";
            case "PATCH":
                return "bg-purple-500";
            default:
                return "bg-gray-400";
        }
    };

    return (
        <NodeViewWrapper
            ref={nodeRef}
            className={`ml-8 group cursor-pointer hover:bg-gray-50 rounded-lg pt-2 border-2 relative bg-white ${
                isSelected
                    ? "border-blue-500"
                    : selected
                    ? "border-gray-500 "
                    : "border-white hover:border-gray-200"
            } `}
            onClick={handleClick}
            tabIndex={0}
        >
            <NodeBubbleBar
                open={bubbleOpen}
                onOpenChange={setBubbleOpen}
                onCopy={handleCopy}
                onDelete={handleDelete}
                onEdit={handleEdit}
            />
            <div className="pl-4">
                <div className="flex items-center pb-2">
                    <span
                        className={`px-2 py-1 text-xs rounded-md text-white font-bold mr-2 ${getMethodColor(
                            info.method
                        )}`}
                    >
                        {info.method?.toUpperCase() || "METHOD"}
                    </span>
                    <span className="text-xl font-bold text-black group-hover:cursor-text">
                        {info.name || "API name"}
                    </span>
                </div>
                <div>
                    <p className="m-0 text-sm text-gray-600 group-hover:cursor-text">
                        {info.description}
                    </p>
                    <p className="m-0 py-2 text-sm text-black font-semibold group-hover:cursor-text w-fit">
                        End Point : {info.endPoint}
                    </p>
                </div>
            </div>

            <div className="ml-8 overflow-hidden">
                {fields && fields.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {fields.map(
                            (field: APIinterfaceParameter, index: number) => {
                                if (
                                    field.name.trim() === "" &&
                                    field.type.trim() === "" &&
                                    field.description.trim() === ""
                                ) {
                                    return;
                                }
                                return (
                                    <div key={index} className="py-2 px-4">
                                        <div className="flex justify-between items-center m-0 p-0">
                                            <div className="flex items-center">
                                                <span className="font-medium text-gray-800 group-hover:cursor-text">
                                                    {field.name}
                                                </span>
                                                {field.required && (
                                                    <span className="text-2xl text-red-500 rounded">
                                                        *
                                                    </span>
                                                )}
                                            </div>

                                            {field.type && (
                                                <span className="text-xs bg-gray-100 px-1 py-1 rounded text-gray-600 mr-2 group-hover:cursor-text">
                                                    {field.type}
                                                </span>
                                            )}
                                        </div>
                                        {field.description && (
                                            <p className="m-0 p-0 text-sm text-gray-500 group-hover:cursor-text w-fit">
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
            </div>
        </NodeViewWrapper>
    );
};

export default APIinterfaceComponent;
