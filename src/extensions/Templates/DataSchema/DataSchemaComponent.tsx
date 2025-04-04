import { NodeViewWrapper } from "@tiptap/react";
import { NodeViewProps } from "@tiptap/core";
import { useNodeSelection } from "@/app/viewModels/context/NodeSelectionContext";

export interface DataSchemaField {
    name: string;
    type: string;
    description: string;
}

const DataSchemaComponent = ({ node, selected }: NodeViewProps) => {
    const { id, config } = node.attrs;
    const { selectedNode, selectNode } = useNodeSelection();
    const isSelected = selectedNode === id;
    const fields = config?.fields || [];
    const info = config?.info || {};

    const handleClick = () => {
        if (window.getSelection()?.toString()) return;
        selectNode(isSelected ? null : id);
    };

    return (
        <NodeViewWrapper
            className={`ml-8 group cursor-pointer hover:bg-gray-50 rounded-lg pt-2 border-2 bg-white ${
                isSelected
                    ? "border-blue-500"
                    : selected
                    ? "border-gray-500"
                    : "border-white hover:border-gray-200"
            } ${selected ? "select-none" : ""}`}
            onMouseDown={(e: React.MouseEvent) => e.stopPropagation()}
            onClick={handleClick}
        >
            <div className="pl-4">
                <div className="flex justify-between">
                    <h2 className="text-xl font-bold text-black group-hover:cursor-text">
                        {info.name || "Schema Name"}
                    </h2>
                    <div className="flex items-center mt-1 mr-3">
                        <span className="px-2 py-1 text-xs bg-gray-100 rounded-md text-gray-700 group-hover:cursor-text">
                            {info.type || "Schema Type"}
                        </span>
                    </div>
                </div>
                <p className="mt-0 text-sm text-gray-600 group-hover:cursor-text">
                    {info.description || "Schema Description"}
                </p>
            </div>

            <div className="ml-8 overflow-hidden">
                {fields && fields.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {fields.map((field: DataSchemaField, index: number) => {
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
                                        <p className="mt-0 text-sm text-gray-500 group-hover:cursor-text">
                                            {field.description}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
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

export default DataSchemaComponent;
