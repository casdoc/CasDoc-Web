import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { useNodeSelection } from "../../viewModels/NodeSelectionContext";

function CustomNode({ id, data }: any) {
    const { selectedNode, selectNode } = useNodeSelection();
    const isSelected = selectedNode === id;

    const handleClick = () => {
        selectNode(isSelected ? null : id);
    };

    return (
        <button onClick={handleClick}>
            <div
                className={`px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400 ${
                    isSelected && "border-yellow-500"
                }`}
            >
                <div className="flex">{data.label}</div>

                <Handle
                    type="target"
                    position={Position.Left}
                    className="w-0.5 rounded-none h-5 border-0 !bg-gray-400"
                />
                <Handle
                    type="source"
                    position={Position.Right}
                    className="w-0.5 rounded-none h-5 border-0 !bg-gray-400"
                />
            </div>
        </button>
    );
}

export default memo(CustomNode);
