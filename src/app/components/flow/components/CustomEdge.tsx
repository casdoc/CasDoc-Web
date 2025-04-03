import React, { useEffect } from "react";
import {
    BaseEdge,
    EdgeLabelRenderer,
    EdgeProps,
    getSmoothStepPath,
    useReactFlow,
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
        selected,
        target,
        source,
        label,
        data,
    } = props;

    const { selectedNode, showTarget, showSource } = useNodeSelection();
    const { updateEdge } = useReactFlow();

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

    useEffect(() => {
        updateEdge(id, {
            animated: edgeColor === pinkColor,
        });
    }, [edgeColor, updateEdge, id]);

    console.log("bidirectional:", data?.bidirectional);

    return (
        <>
            <BaseEdge
                id={id}
                path={edgePath}
                style={{ stroke: edgeColor, strokeWidth: 2 }}
                markerStart={
                    data?.bidirectional ? `url(#${id}-start-arrow)` : undefined
                }
                markerEnd={`url(#${id}-arrow)`}
            />
            <EdgeLabelRenderer>
                <div
                    className="absolute text-sm font-semibold text-gray-600"
                    style={{
                        transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
                    }}
                >
                    {label}
                </div>
            </EdgeLabelRenderer>
            <defs>
                <marker
                    id={`${id}-arrow`}
                    markerWidth="30"
                    markerHeight="30"
                    refX="5.2"
                    refY="3"
                    orient="auto"
                >
                    <path d="M0,0 L0,6 L6,3 Z" fill={edgeColor} />
                </marker>
                <marker
                    id={`${id}-start-arrow`}
                    markerWidth="30"
                    markerHeight="30"
                    refX="5.2"
                    refY="3"
                    orient="auto-start-reverse"
                >
                    <path d="M0,0 L0,6 L6,3 Z" fill={edgeColor} />
                </marker>
            </defs>
        </>
    );
};

export default CustomEdge;
