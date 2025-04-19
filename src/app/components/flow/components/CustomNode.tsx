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

    const getTopicShadowColor = () => {
        if (data.level == 1) return "shadow-indigo-400";
        else if (data.level == 2) return "shadow-blue-400";
        else if (data.level == 3) return "shadow-teal-400";
        return "shadow-gray-400";
    };

    return (
        <button
            disabled={data.type === "root"}
            onClick={handleClick}
            className={`${
                data.type === "root" ? "cursor-not-allowed" : "hover:opacity-70"
            }`}
        >
            <div
                className={`relative px-4 py-2 shadow-md rounded-md bg-white border-2  ${
                    isSelected ? "border-blue-500" : "border-stone-400"
                } ${
                    data.type.startsWith("topic")
                        ? `${getTopicShadowColor()}`
                        : data.type.startsWith("template")
                        ? "shadow-amber-200"
                        : ""
                }`}
            >
                {data.isAffected && data.type.startsWith("template") && (
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
