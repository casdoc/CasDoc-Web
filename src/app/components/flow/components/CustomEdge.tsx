import React from "react";
import { BaseEdge, EdgeProps, getSmoothStepPath } from "@xyflow/react";

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
    } = props;

    const [edgePath] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const edgeColor = selected ? "#ff66cc" : "#BEBEBE";
    console.log(edgePath);
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
