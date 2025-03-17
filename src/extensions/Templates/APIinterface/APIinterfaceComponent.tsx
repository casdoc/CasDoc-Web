import { NodeViewWrapper } from "@tiptap/react";
import { NodeViewProps } from "@tiptap/core";
import { useNodeSelection } from "@/app/viewModels/context/NodeSelectionContext";
import { useEffect, useState } from "react";
import { useDocContext } from "@/app/viewModels/context/DocContext";

interface Parameters {
    name: string;
    type: string;
    required: boolean;
    description: string;
}

const APIinterfaceComponent: React.FC<NodeViewProps> = ({ node, selected }) => {
    const {
        id,
        name: initName,
        method: initConfig,
        fields: initFields,
    } = node.attrs;

    const { selectedNode, selectNode } = useNodeSelection();
    const isSelected = selectedNode === id;
    const [name, setName] = useState(initName || "Schema Name");
    const [config, setConfig] = useState(initConfig || {});
    const [fields, setFields] = useState<Parameters[]>(initFields || []);
    const { document } = useDocContext();

    useEffect(() => {
        console.debug("document", document);
        if (!document) return;
        const topicData = document.getTopicById(id);
        console.log("topicData", topicData);
        if (!topicData) return;
        if (topicData.name !== name) {
            setName(topicData.name);
        }
        if (topicData.config !== config) {
            setConfig(topicData.config);
        }
        if (topicData.fields !== fields) {
            setFields(topicData.fields);
        }
    }, [document, id, name, fields, config]);

    const handleClick = () => {
        selectNode(isSelected ? null : id);
    };

    return (
        <NodeViewWrapper
            className={`ml-8 cursor-pointer hover:bg-gray-50 rounded-lg pt-2 border-2 bg-white ${
                isSelected
                    ? "border-indigo-500"
                    : selected
                    ? "border-gray-500"
                    : "border-white hover:border-gray-200"
            }`}
            onClick={handleClick}
        >
            <div className="pl-4">
                <div className="flex items-center pb-2">
                    <span
                        className={`px-2 py-1 text-xs rounded-md text-white font-bold mr-2 ${
                            config.method === "GET"
                                ? "bg-green-500"
                                : config.method === "POST"
                                ? "bg-blue-500"
                                : config.method === "PUT"
                                ? "bg-yellow-500"
                                : config.method === "DELETE"
                                ? "bg-red-500"
                                : "bg-gray-400"
                        }`}
                    >
                        {config.method || "Method"}
                    </span>
                    <span className="text-xl font-bold text-indigo-700">
                        {name || "API name"}
                    </span>
                </div>
                <div>
                    <p className="m-0 text-sm text-gray-600">
                        {config.description}
                    </p>
                    <p className="m-0 py-2 text-sm text-black font-semibold">
                        URI : {config.uri}
                    </p>
                </div>
            </div>

            <div className="ml-8 overflow-hidden">
                {fields && fields.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {fields.map((field: Parameters, index: number) => {
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
                                        <span className="text-xs bg-gray-100 px-1 py-1 rounded text-gray-600 mr-2">
                                            {field.type}
                                        </span>
                                    </div>
                                    {field.description && (
                                        <p className="m-0 p-0 text-sm text-gray-500">
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

export default APIinterfaceComponent;
