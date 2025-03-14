import React, { memo } from "react";
import { Handle, Position, useConnection } from "@xyflow/react";
import { useNodeSelection } from "../../viewModels/context/NodeSelectionContext";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomNode({ id, data }: any) {
    const { selectedNode, selectNode } = useNodeSelection();
    const isSelected = selectedNode === id;

    const connection = useConnection();
    const isTarget = connection.inProgress && connection.fromNode.id !== id;

    const handleClick = () => {
        selectNode(isSelected ? null : id);
    };

    return (
        <button onClick={handleClick}>
            <div
                className={`px-4 py-2 shadow-md rounded-md bg-white border-2 ${
                    isSelected ? "border-indigo-500" : "border-stone-400"
                }`}
            >
                <div className="flex">{data.label}</div>

                {!connection.inProgress && (
                    <Handle
                        id="left"
                        type="target"
                        position={Position.Left}
                        className="rounded-none h-5 border-0 !bg-gray-400"
                    />
                )}
                {(!connection.inProgress || isTarget) && (
                    <Handle
                        id="right"
                        type="source"
                        position={Position.Right}
                        className="rounded-none h-5 border-0 !bg-gray-400"
                    />
                )}
            </div>
        </button>
    );
}

export default memo(CustomNode);
