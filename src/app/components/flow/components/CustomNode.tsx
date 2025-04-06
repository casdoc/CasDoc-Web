import React, { memo } from "react";
import { Handle, Position, useConnection } from "@xyflow/react";
import { useNodeSelection } from "../../../viewModels/context/NodeSelectionContext";

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
        <button
            disabled={id === "root"}
            onClick={handleClick}
            className={`${
                id === "root" ? "cursor-not-allowed" : "hover:opacity-70"
            }`}
        >
            <div
                className={`relative px-4 py-2 shadow-md rounded-md bg-white border-2  ${
                    isSelected ? "border-blue-500" : "border-stone-400"
                } ${
                    data.type.startsWith("topic")
                        ? "shadow-cyan-200"
                        : data.type.startsWith("template")
                        ? "shadow-amber-200"
                        : ""
                }`}
            >
                {data.isAffected || (
                    <div className="absolute -top-1 -right-1.5 w-2.5 h-2.5 rounded-full bg-red-400" />
                )}
                <div className="max-w-44 overflow-hidden whitespace-nowrap truncate">
                    {data.label}
                </div>

                {!connection.inProgress && (
                    <Handle
                        id="left"
                        type="target"
                        isConnectableStart={false}
                        position={Position.Left}
                        className="rounded-none h-5 border-0 !bg-gray-400"
                    />
                )}
                {(!connection.inProgress || isTarget) && (
                    <Handle
                        id="right"
                        type="source"
                        isConnectableStart={data.type.startsWith("template")}
                        isConnectableEnd={data.type.startsWith("template")}
                        position={Position.Right}
                        className="rounded-none h-5 border-0 !bg-gray-400"
                    />
                )}
            </div>
        </button>
    );
}

export default memo(CustomNode);
