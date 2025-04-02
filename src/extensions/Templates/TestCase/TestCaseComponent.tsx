import { NodeViewWrapper } from "@tiptap/react";
import { NodeViewProps } from "@tiptap/core";
import { useNodeSelection } from "@/app/viewModels/context/NodeSelectionContext";
import { useCallback } from "react";

interface Field {
    step: string;
    done: string;
}

const TestCaseComponent = ({ node, selected }: NodeViewProps) => {
    const { id, config } = node.attrs;
    const { selectedNode, selectNode } = useNodeSelection();
    const isSelected = selectedNode === id;
    const fields = config?.fields || [];
    const info = config?.info || {};
    const handleClick = () => {
        selectNode(isSelected ? null : id);
    };

    const isTaskDone = useCallback((status: string) => {
        if (!status) return false;
        const str = status.trim().toLowerCase();
        return str === "true" || str === "yes" || str === "ok";
    }, []);

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
            <div className="px-3 py-1 border-b rounded-sm">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">
                            {info.serial}
                        </p>
                        <h2 className="text-xl font-bold text-gray-900 mt-0">
                            {info.name || "New Test Case"}
                        </h2>
                        {info.description && (
                            <p className="text-sm text-gray-600 mt-1">
                                {info.description}
                            </p>
                        )}
                    </div>
                </div>
            </div>
            <div className="px-4 py-3 space-y-2">
                <div>
                    <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Expected Result
                    </h3>
                    <p className="text-sm text-gray-700 mt-1 mb-4">
                        {info.expectedResult}
                    </p>
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Steps
                    </h3>
                    <ul className="divide-y divide-gray-100 mt-1">
                        {fields.map((field: Field, index: number) => (
                            <li key={index} className="flex items-start py-2">
                                <input
                                    type="checkbox"
                                    checked={isTaskDone(field.done)}
                                    readOnly
                                    className="mt-1 mr-2"
                                />
                                <span
                                    className={`text-sm ${
                                        isTaskDone(field.done)
                                            ? "line-through text-gray-400"
                                            : "text-gray-800"
                                    }`}
                                >
                                    {index + 1}. {field.step}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </NodeViewWrapper>
    );
};

export default TestCaseComponent;
