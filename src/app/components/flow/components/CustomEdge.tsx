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
        pathOptions,
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
        offset: pathOptions.offset,
    });
    const pinkColor = "#FF79BC";
    const grayColor = "#BEBEBE";

    const edgeColor =
        selected ||
        (selectedNode === source &&
            (showTarget || (showSource && data?.bidirectional))) ||
        (selectedNode === target &&
            (showSource || (showTarget && data?.bidirectional)))
            ? pinkColor
            : grayColor;

    useEffect(() => {
        updateEdge(
            id,
            { animated: edgeColor === pinkColor },
            { replace: true }
        );
    }, [edgeColor, updateEdge, id]);

    return (
        <>
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: "absolute",
                        transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
                        cursor: "grab",
                        width: "20px",
                        height: "20px",
                        backgroundColor: "blue",
                        borderRadius: "50%",
                        zIndex: 10,
                        pointerEvents: "all",
                    }}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const startX = e.clientX;

                        const handleMouseMove = (moveEvent: MouseEvent) => {
                            const deltaX = moveEvent.clientX - startX;
                            console.log("X 變化量:", deltaX);
                            updateEdge(
                                id,
                                {
                                    animated: edgeColor === pinkColor,
                                    pathOptions: {
                                        offset: 50 + deltaX,
                                    },
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                } as any,
                                { replace: true }
                            );
                        };

                        const handleMouseUp = () => {
                            window.removeEventListener(
                                "mousemove",
                                handleMouseMove
                            );
                            window.removeEventListener(
                                "mouseup",
                                handleMouseUp
                            );
                        };

                        window.addEventListener("mousemove", handleMouseMove);
                        window.addEventListener("mouseup", handleMouseUp);
                    }}
                />
            </EdgeLabelRenderer>
            <BaseEdge
                id={id}
                path={edgePath}
                style={{ stroke: edgeColor, strokeWidth: 2 }}
                markerStart={
                    data?.bidirectional ? `url(#${id}-start-arrow)` : undefined
                }
                markerEnd={`url(#${id}-arrow)`}
            />
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
