import React, { useEffect } from "react";
import {
    BaseEdge,
    EdgeLabelRenderer,
    EdgeProps,
    getSmoothStepPath,
    useReactFlow,
} from "@xyflow/react";
import { useNodeSelection } from "@/app/viewModels/context/NodeSelectionContext";
import { useGraphContext } from "@/app/viewModels/context/GraphContext";

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
    const { updateEdge, getZoom } = useReactFlow();

    const [edgePath] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
        offset: pathOptions?.offset,
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

    const { updateOffset } = useGraphContext();

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
                {edgeColor === pinkColor ? (
                    <div
                        style={{
                            transform: `translate(-50%, -50%) translate(${
                                Math.max(sourceX, targetX) + pathOptions.offset
                            }px, ${(sourceY + targetY) / 2}px)`,
                        }}
                        className="absolute cursor-grab w-2.5 h-6 border border-gray-800 bg-white z-10 pointer-events-auto"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const startX = e.clientX;
                            let deltaX: number;

                            const handleMouseMove = (moveEvent: MouseEvent) => {
                                deltaX = moveEvent.clientX - startX;
                                const zoom = getZoom();
                                if (pathOptions.offset + deltaX > 15) {
                                    console.log("zoom:", getZoom());
                                    updateEdge(
                                        id,
                                        {
                                            animated: edgeColor === pinkColor,
                                            pathOptions: {
                                                offset:
                                                    pathOptions.offset +
                                                    deltaX * (1 / zoom),
                                            },
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        } as any,
                                        { replace: true }
                                    );
                                }
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
                                const zoom = getZoom();
                                if (
                                    pathOptions.offset + deltaX * (1 / zoom) >
                                    15
                                ) {
                                    updateOffset(
                                        {
                                            source: source,
                                            target: target,
                                            data: data!,
                                        },
                                        pathOptions.offset + deltaX * (1 / zoom)
                                    );
                                }
                            };

                            window.addEventListener(
                                "mousemove",
                                handleMouseMove
                            );
                            window.addEventListener("mouseup", handleMouseUp);
                        }}
                    />
                ) : (
                    <div
                        className="absolute text-sm font-semibold text-gray-600"
                        style={{
                            transform: `translate(-50%, -50%) translate(${
                                Math.max(sourceX, targetX) + pathOptions?.offset
                            }px, ${(sourceY + targetY) / 2}px)`,
                        }}
                    >
                        {label}
                    </div>
                )}
            </EdgeLabelRenderer>
            <BaseEdge
                id={id}
                path={edgePath}
                style={{ stroke: edgeColor, strokeWidth: 2 }}
                markerStart={
                    data?.bidirectional ? `url(#${id}-start-arrow)` : undefined
                }
                markerEnd={`url(#${id}-arrow)`}
                interactionWidth={40}
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
