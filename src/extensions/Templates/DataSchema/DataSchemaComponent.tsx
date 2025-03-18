import { NodeViewWrapper } from "@tiptap/react";
import { NodeViewProps } from "@tiptap/core";
import { useNodeSelection } from "@/app/viewModels/context/NodeSelectionContext";
import { useEffect, useState } from "react";
import { useDocContext } from "@/app/viewModels/context/DocContext";

interface Field {
    name: string;
    type: string;
    description: string;
}

const DataSchemaComponent: React.FC<NodeViewProps> = ({ node, selected }) => {
    const { id, config: initConfig, fields: initFields } = node.attrs;
    const { selectedNode, selectNode } = useNodeSelection();
    const isSelected = selectedNode === id;
    const [config, setConfig] = useState(initConfig || {});
    const [fields, setFields] = useState<Field[]>(initFields || []);
    const { document } = useDocContext();

    useEffect(() => {
        console.debug("document", document);
        if (!document) return;
        const topicData = document.getTopicById(id);
        console.debug("topicData", topicData);
        if (topicData && topicData.config !== config) {
            setConfig(topicData.config);
        }
        if (topicData && topicData.fields !== fields) {
            setFields(topicData.fields);
        }
    }, [document, id, config, fields]);

    const handleClick = () => {
        selectNode(isSelected ? null : id);
    };

    return (
        <NodeViewWrapper
            className={`ml-8 cursor-pointer hover:bg-gray-50 rounded-lg pt-2 border-2 bg-white ${
                isSelected
                    ? "border-blue-500"
                    : selected
                    ? "border-gray-500"
                    : "border-white hover:border-gray-200"
            }`}
            onClick={handleClick}
        >
            <div className="pl-4">
                <div className="flex justify-between">
                    <h2 className="text-xl font-bold text-black">
                        {config.name || "Schema Name"}
                    </h2>
                    <div className="flex items-center mt-1 mr-3">
                        <span className="px-2 py-1 text-xs bg-gray-100 rounded-md text-gray-700">
                            {config.type || "Schema Type"}
                        </span>
                    </div>
                </div>
                <p className="mt-0 text-sm text-gray-600">
                    {config.description || "Schema Description"}
                </p>
            </div>

            <div className="ml-8 overflow-hidden">
                {fields && fields.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {fields.map((field: Field, index: number) => {
                            if (
                                field.name.trim() === "" &&
                                field.type.trim() === "" &&
                                field.description.trim() === ""
                            ) {
                                return;
                            }
                            return (
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
                                        <p className="mt-0 text-sm text-gray-500">
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
