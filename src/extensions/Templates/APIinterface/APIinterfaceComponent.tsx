import { NodeViewWrapper } from "@tiptap/react";
import { NodeViewProps } from "@tiptap/core";
import { useNodeSelection } from "@/app/viewModels/context/NodeSelectionContext";
import { useEffect, useState } from "react";
import { useDocContext } from "@/app/viewModels/context/DocContext";

interface APIParameter {
    name: string;
    type: string;
    required: boolean;
    description?: string;
}

const APIinterfaceComponent: React.FC<NodeViewProps> = ({ node, selected }) => {
    const {
        id,
        name: initName,
        method: initMethod,
        description: initDescription,
        parameters: initParameters,
    } = node.attrs;

    const { selectedNode, selectNode } = useNodeSelection();
    const isSelected = selectedNode === id;

    const [name, setName] = useState(initName || "API Name");
    const [method, setMethod] = useState(initMethod || "GET");
    const [description, setDescription] = useState(
        initDescription || "API Description"
    );
    const [parameters, setParameters] = useState<APIParameter[]>(
        initParameters || []
    );

    const { document } = useDocContext();

    useEffect(() => {
        if (initName !== undefined) {
            setName(initName);
        }
        if (initMethod !== undefined) {
            setMethod(initMethod);
        }
        if (initDescription !== undefined) {
            setDescription(initDescription);
        }
        if (initParameters !== undefined) {
            setParameters(initParameters);
        }
    }, [initName, initMethod, initDescription, initParameters]);

    useEffect(() => {
        console.debug("document", document);
        if (!document) return;
        const apiData = document.getTopicById(id);
        console.debug("apiData", apiData);

        if (apiData && apiData.name !== name) {
            setName(apiData.name);
        }
        if (apiData && apiData.method !== method) {
            setMethod(apiData.method);
        }
        if (apiData && apiData.description !== description) {
            setDescription(apiData.description);
        }
        if (apiData && apiData.parameters !== parameters) {
            setParameters(apiData.parameters);
        }
    }, [document, id, name, method, description, parameters]);

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
                {/* API Name & HTTP Method */}
                <div className="flex justify-between">
                    <h2 className="text-xl font-bold text-indigo-700">
                        {name || "API Name"}
                    </h2>
                    <div className="flex items-center mt-1 mr-3">
                        <span
                            className={`px-2 py-1 text-xs rounded-md text-white ${
                                method === "GET"
                                    ? "bg-green-500"
                                    : method === "POST"
                                    ? "bg-blue-500"
                                    : method === "PUT"
                                    ? "bg-yellow-500"
                                    : method === "DELETE"
                                    ? "bg-red-500"
                                    : "bg-gray-500"
                            }`}
                        >
                            {method || "METHOD"}
                        </span>
                    </div>
                </div>

                {/* API Description */}
                <p className="mt-0 text-sm text-gray-600">
                    {description || "API Description"}
                </p>
            </div>

            {/* Parameters Section */}
            <div className="ml-8 overflow-hidden">
                {parameters && parameters.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        <div className="py-2 px-4 font-semibold text-gray-800">
                            參數 (Parameters)
                        </div>
                        {parameters.map(
                            (param: APIParameter, index: number) => {
                                return (
                                    <div
                                        key={index}
                                        className="py-2 px-4 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-gray-800">
                                                {param.name}
                                            </span>
                                            <div className="flex items-center">
                                                <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 mr-2">
                                                    {param.type}
                                                </span>
                                                {param.required && (
                                                    <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">
                                                        必填
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        {param.description && (
                                            <p className="mt-0 text-sm text-gray-500">
                                                {param.description}
                                            </p>
                                        )}
                                    </div>
                                );
                            }
                        )}
                    </div>
                ) : (
                    <div className="p-4 text-center text-gray-400">
                        尚未定義任何參數
                    </div>
                )}
            </div>
        </NodeViewWrapper>
    );
};

export default APIinterfaceComponent;
