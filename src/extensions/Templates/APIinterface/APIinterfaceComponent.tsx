import { NodeViewWrapper } from "@tiptap/react";
import { NodeViewProps } from "@tiptap/core";
import { useNodeSelection } from "@/app/viewModels/context/NodeSelectionContext";
import { useCallback, useEffect, useState } from "react";
import NodeBubbleBar from "@/app/components/doc/Popover/NodeBubbleBar";

export interface APIinterfaceParameter {
    name: string;
    type: string;
    required: boolean;
    description: string;
}

const APIinterfaceComponent: React.FC<NodeViewProps> = ({
    node,
    selected,
    editor,
    getPos,
}) => {
    const { id, config } = node.attrs;
    const info = config?.info || {};
    const fields = config?.fields || [];
    const [bubbleOpen, setBubbleOpen] = useState(false);
    const { selectedNode } = useNodeSelection();
    const isSelected = selectedNode === id;

    const handleEdit = useCallback(() => {
        const event = new CustomEvent("global-node-select", {
            detail: { id },
        });
        window.dispatchEvent(event);
    }, [id]);
    // Add a direct keyboard event handler
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Check if this is Ctrl+Enter (or Cmd+Enter on Mac)
            const isMod = e.ctrlKey || e.metaKey;
            if (isMod && e.key === "Enter") {
                // Only handle if this node is selected
                if (selected) {
                    handleEdit();
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        };
        if (!selected) document.removeEventListener("keydown", handleKeyDown);
        else document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleEdit, id, selected]);

    const handleClick = (): void => {
        setBubbleOpen(!bubbleOpen);
    };

    const handleCopy = () => {
        if (typeof getPos === "function") {
            const pos = getPos();
            editor.commands.setNodeSelection(pos);

            const event = new CustomEvent("node-copy", {
                detail: { pos },
            });
            window.dispatchEvent(event);
        }
    };

    const handleDelete = () => {
        if (typeof getPos === "function") {
            const pos = getPos();

            const event = new CustomEvent("node-delete", {
                detail: { id, pos },
            });
            window.dispatchEvent(event);
        }
    };

    const getMethodColor = (method?: string): string => {
        switch (method?.toUpperCase()) {
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
            className={`ml-8 cursor-pointer hover:bg-gray-50 rounded-lg pt-2 border-2 relative bg-white ${
                isSelected
                    ? "border-blue-500"
                    : selected
                    ? "border-gray-500"
                    : "border-white hover:border-gray-200"
            }`}
            onClick={handleClick}
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
                    <span className="text-xl font-bold text-black">
                        {info.name || "API name"}
                    </span>
                </div>
                <div>
                    <p className="m-0 text-sm text-gray-600">
                        {info.description}
                    </p>
                    <p className="m-0 py-2 text-sm text-black font-semibold">
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
                                                <span className="font-medium text-gray-800">
                                                    {field.name}
                                                </span>
                                                {field.required && (
                                                    <span className="text-2xl text-red-500 rounded">
                                                        *
                                                    </span>
                                                )}
                                            </div>

                                            {field.type && (
                                                <span className="text-xs bg-gray-100 px-1 py-1 rounded text-gray-600 mr-2">
                                                    {field.type}
                                                </span>
                                            )}
                                        </div>
                                        {field.description && (
                                            <p className="m-0 p-0 text-sm text-gray-500">
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
