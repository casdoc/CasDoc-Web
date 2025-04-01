import React from "react";
import {
    BaseEdge,
    EdgeLabelRenderer,
    EdgeProps,
    getSmoothStepPath,
} from "@xyflow/react";
import { useNodeSelection } from "@/app/viewModels/context/NodeSelectionContext";

const CustomEdge = (props: EdgeProps) => {
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

    const [edgePath, labelX, labelY] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });
    const pinkColor = "#FF79BC";
    const grayColor = "#BEBEBE";

    const edgeColor =
        selected ||
        (selectedNode === source && showTarget) ||
        (selectedNode === target && showSource)
            ? pinkColor
            : grayColor;

    return (
        <>
            <BaseEdge
                id={id}
                path={edgePath}
                style={{ ...style, stroke: edgeColor, strokeWidth: 2 }}
                markerEnd={`url(#${id}-arrow)`}
            />
            <EdgeLabelRenderer>
                <div
                    className="absolute text-sm font-semibold"
                    style={{
                        transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
                    }}
                >
                    default
                </div>
            </EdgeLabelRenderer>
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
