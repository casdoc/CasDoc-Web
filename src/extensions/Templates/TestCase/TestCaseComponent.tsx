import { NodeViewWrapper } from "@tiptap/react";
import { NodeViewProps } from "@tiptap/core";
import { useNodeSelection } from "@/app/viewModels/context/NodeSelectionContext";
import { useCallback, useState } from "react";
import NodeBubbleBar from "@/app/components/doc/Popover/NodeBubbleBar";
import useCustomNodeActions from "@/extensions/hooks/useCustomNodeActions";

interface Field {
    step: string;
    done: string;
}

const TestCaseComponent = ({
    node,
    selected,
    editor,
    getPos,
    updateAttributes,
}: NodeViewProps) => {
    const { id, config } = node.attrs;
    const { selectedNode } = useNodeSelection();
    const isSelected = selectedNode === id;
    const fields = config?.fields || [];
    const info = config?.info || {};
    const [bubbleOpen, setBubbleOpen] = useState(false);
    const { handleEdit, handleCopy, handleDelete } = useCustomNodeActions({
        id,
        selected,
        getPos,
        editor,
    });

    const handleClick = (): void => {
        if (window.getSelection()?.toString()) {
            return;
        }
        setTimeout(() => {
            if (window.getSelection()?.toString())
                window.getSelection()?.removeAllRanges();
        }, 0);
        setBubbleOpen(!bubbleOpen);
    };

    const isTaskDone = useCallback((status: string) => {
        if (!status) return false;
        const str = status.trim().toLowerCase();
        return str === "true" || str === "yes" || str === "ok";
    }, []);

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

    return (
        <NodeViewWrapper
            className={`ml-8 group cursor-pointer hover:bg-gray-50 rounded-lg pt-2 border-2 relative bg-white ${
                isSelected
                    ? "border-blue-500"
                    : selected
                    ? "border-gray-500"
                    : "border-white hover:border-gray-200"
            } `}
            onClick={handleClick}
        >
            <NodeBubbleBar
                open={bubbleOpen}
                onOpenChange={setBubbleOpen}
                onCopy={handleCopy}
                onDelete={handleDelete}
                onEdit={handleEdit}
            />
            <div className="px-3 py-1 border-b rounded-sm">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xs font-medium text-gray-500 mb-1 group-hover:cursor-text w-fit">
                            {info.serial}
                        </p>
                        <h2 className="text-xl font-bold text-gray-900 mt-0 group-hover:cursor-text w-fit">
                            {info.name || "New Test Case"}
                        </h2>
                        {info.description && (
                            <p className="text-sm text-gray-600 mt-1 group-hover:cursor-text">
                                {info.description}
                            </p>
                        )}
                    </div>
                </div>
            </div>
            <div className="px-4 py-3 space-y-2">
                <div>
                    <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide group-hover:cursor-text w-fit">
                        Expected Result
                    </h3>
                    <p className="text-sm text-gray-700 mt-1 mb-4 group-hover:cursor-text">
                        {info.expectedResult}
                    </p>
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide group-hover:cursor-text w-fit">
                        Steps
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
                                    } group-hover:cursor-text`}
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
