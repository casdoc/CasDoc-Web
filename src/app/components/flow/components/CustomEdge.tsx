import React from "react";
import { EdgeProps, getSmoothStepPath } from "@xyflow/react";

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

    return (
        <>
            <defs>
                <marker
                    id={`${id}-arrow`}
                    markerWidth="6"
                    markerHeight="6"
                    refX="5.3"
                    refY="3"
                    orient="auto"
                    markerUnits="strokeWidth"
                >
                    <path d="M0,0 L0,6 L6,3 Z" fill={edgeColor} />
                </marker>
            </defs>
            <path
                id={id}
                className="react-flow__edge-path"
                d={edgePath}
                style={{
                    ...style,
                    stroke: edgeColor,
                    strokeWidth: 2,
                }}
                markerEnd={`url(#${id}-arrow)`}
            />
        </>
    );
};

export default CustomEdge;
