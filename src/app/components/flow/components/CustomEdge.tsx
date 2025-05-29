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
                        className="absolute cursor-col-resize w-2.5 h-7 border border-gray-800 bg-white rounded-sm z-10 pointer-events-auto"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const startX = e.clientX;
                            let deltaX: number;

                            const handleMouseMove = (moveEvent: MouseEvent) => {
                                const zoom = 1 / getZoom();
                                deltaX = moveEvent.clientX - startX;
                                if (pathOptions.offset + deltaX * zoom > 15) {
                                    updateEdge(id, {
                                        pathOptions: {
                                            offset:
                                                pathOptions.offset +
                                                deltaX * zoom,
                                        },
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    } as any);
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
                                const zoom = 1 / getZoom();
                                if (pathOptions.offset + deltaX * zoom > 15) {
                                    const offset =
                                        pathOptions.offset + deltaX * zoom;
                                    updateOffset(source, target, offset);
                                }
                            };

                            window.addEventListener(
                                "mousemove",
                                handleMouseMove
                            );
                            window.addEventListener("mouseup", handleMouseUp);
                        }}
                        onMouseUp={() => {
                            setTimeout(() => {
                                updateEdge(id, { selected: true });
                            });
                        }}
                    />
                ) : (
                    <div
                        className="absolute text-sm font-semibold text-gray-600 max-w-28 truncate"
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
