import React from "react";
import { BaseEdge, EdgeProps, getSmoothStepPath } from "@xyflow/react";
import { useNodeSelection } from "@/app/viewModels/context/NodeSelectionContext";

const CustomEdge: React.FC<EdgeProps> = (props) => {
    const {
        id,
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
        style = {},
        selected,
        target,
        source,
    } = props;

    const { selectedNode, showTarget, showSource } = useNodeSelection();

    const [edgePath] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const edgeColor =
        selected ||
        (selectedNode === target && showTarget) ||
        (selectedNode === source && showSource)
            ? "#FF79BC"
            : "#BEBEBE";

    return (
        <>
            <BaseEdge
                id={id}
                path={edgePath}
                style={{ ...style, stroke: edgeColor, strokeWidth: 2 }}
                markerEnd={`url(#${id}-arrow)`}
            />
            <defs>
                <marker
                    id={`${id}-arrow`}
                    markerWidth="30"
                    markerHeight="30"
                    refX="5"
                    refY="3"
                    orient="auto"
                >
                    <path d="M0,0 L0,6 L6,3 Z" fill={edgeColor} />
                </marker>
            </defs>
        </>
    );
};

export default CustomEdge;
