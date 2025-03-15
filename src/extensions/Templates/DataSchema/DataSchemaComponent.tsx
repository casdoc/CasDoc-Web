import { NodeViewWrapper } from "@tiptap/react";
import { NodeViewProps } from "@tiptap/core";
import { useNodeSelection } from "@/app/viewModels/context/NodeSelectionContext";

interface Field {
    name: string;
    type: string;
    description: string;
}

export const DataSchemaComponent: React.FC<NodeViewProps> = ({
    node,
    selected,
}) => {
    const { id, name, type, description, fields } = node.attrs;
    const { selectedNode, selectNode } = useNodeSelection();
    const isSelected = selectedNode === id;

    const handleClick = () => {
        selectNode(isSelected ? null : id);
    };

    return (
        <NodeViewWrapper
            className={`cursor-pointer hover:bg-gray-50 p-6 border-2 rounded-lg shadow-md bg-white ${
                isSelected && "border-indigo-500"
            } ${!isSelected && selected && "border-gray-500"}`}
            onClick={handleClick}
        >
            <div className="mb-4 border-l-4 border-indigo-500 pl-4">
                <div className="flex justify-between">
                    <h2 className="text-2xl font-bold text-indigo-700">
                        {name || "Schema Name"}
                    </h2>
                    <div className="flex items-center mt-1 mr-3">
                        <span className="px-2 py-1 text-xs bg-gray-100 rounded-md text-gray-700">
                            {type || "Schema Type"}
                        </span>
                    </div>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                    {description || "Schema Description"}
                </p>
            </div>

            <div className="border rounded-lg overflow-hidden">
                {fields && fields.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {fields.map((field: Field, index: number) => (
                            <div
                                key={index}
                                className="py-2 px-4 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-gray-800">
                                        {field.name}
                                    </span>
                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                                        {field.type}
                                    </span>
                                </div>
                                {field.description && (
                                    <p className="mt-1 text-sm text-gray-500">
                                        {field.description}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-4 text-center text-gray-400">
                        尚未定義任何 field
                    </div>
                )}
            </div>
        </NodeViewWrapper>
    );
};
