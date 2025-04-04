import { NodeViewWrapper } from "@tiptap/react";
import { NodeViewProps } from "@tiptap/core";
import { useNodeSelection } from "@/app/viewModels/context/NodeSelectionContext";
import { useCallback } from "react";

interface Field {
    acceptance: string;
    done: string;
}

const UserStoryComponent = ({
    node,
    selected,
    updateAttributes,
}: NodeViewProps) => {
    const { id, config } = node.attrs;
    const { selectedNode, selectNode } = useNodeSelection();
    const isSelected = selectedNode === id;
    const fields = config?.fields || [];
    const info = config?.info || {};

    const handleClick = () => {
        selectNode(isSelected ? null : id);
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
            className={`ml-8 cursor-pointer hover:bg-gray-50 rounded-lg pt-2 border-2 bg-white ${
                isSelected
                    ? "border-blue-500"
                    : selected
                    ? "border-gray-500"
                    : "border-white hover:border-gray-200"
            } ${selected ? "select-none" : ""}`}
            onClick={handleClick}
        >
            <div className="px-3 py-1 border-b rounded-sm">
                <div className="flex justify-between items-start">
                    <div>
                        {info.serial.trim() !== "" && (
                            <p className="text-xs font-medium text-gray-500 mb-1">
                                {info.serial}
                            </p>
                        )}
                        <h2 className="text-xl font-bold text-gray-900 mt-0">
                            {info.name || "New Story"}
                        </h2>
                        <div className="flex flex-wrap items-center gap-2 my-1">
                            {info.tag.trim() !== "" && (
                                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded border border-blue-300">
                                    {info.tag}
                                </span>
                            )}
                            {info.priority.trim() !== "" && (
                                <span
                                    className={`text-xs px-2 py-1 rounded font-medium border ${calculatePriorityStyle(
                                        parseInt(info.priority)
                                    )}`}
                                >
                                    P{info.priority}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-4 py-3 space-y-2">
                <div>
                    <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Role
                    </h3>
                    <p className="text-sm text-gray-700 mt-1 mb-4">
                        {info.role}
                    </p>
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Feature
                    </h3>
                    <p className="text-sm text-gray-700 mt-1 mb-4">
                        {info.feature}
                    </p>
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Acceptance Criteria
                    </h3>
                    <ul className="divide-y divide-gray-100 mt-1">
                        {fields.map((field: Field, index: number) => (
                            <li key={index} className="flex items-start py-2">
                                <input
                                    type="checkbox"
                                    checked={isTaskDone(field.done)}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={toggleCheckbox}
                                    className="mt-1 mr-2"
                                />
                                <span
                                    className={`text-sm ${
                                        isTaskDone(field.done)
                                            ? "line-through text-gray-400"
                                            : "text-gray-800"
                                    }`}
                                >
                                    {field.acceptance}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </NodeViewWrapper>
    );
};

export default UserStoryComponent;
