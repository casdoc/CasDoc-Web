import { ConnectionEdge } from "@/app/viewModels/GraphViewModel";
import { GraphNode } from "@/app/viewModels/useDocument";
import { Edge, Node, Position } from "@xyflow/react";

export const convertDataToNodes = (
    data: GraphNode[],
    affectedIds: string[]
): Node[] => {
    if (data.length === 0) return [];
    const defaultPosition = { x: 0, y: 0 };
    return data.map((item: GraphNode) => ({
        id: `${item.id}`,
        position: defaultPosition,
        data: {
            label: item.config?.info.name || item.label || "unknown",
            type: item.type,
            isAffected: affectedIds.includes(item.id.toString()),
            level: item.level,
        },
        type: "custom",
        deletable: false,
    }));
};

export const convertDataToStructuralEdges = (
    graphNodes: GraphNode[]
): Edge[] => {
    if (graphNodes.length === 0) return [];
    return graphNodes
        .filter((node) => node.type !== "root")
        .map((node) => {
            return {
                id: `e-${node.pid}-${node.id}`,
                source: `${node.pid}`,
                target: `${node.id}`,
                type: "default",
                deletable: false,
                selectable: false,
            };
        });
};

export const connectConnectionEdges = (
    connectionEdges: ConnectionEdge[]
): Edge[] => {
    if (connectionEdges.length === 0) return [];
    return connectionEdges.map((e) => {
        return {
            id: `e-${e.source}-${e.target}`,
            source: `${e.source}`,
            target: `${e.target}`,
            type: "custom",
            targetHandle: Position.Right,
            label: e.label,
            data: { bidirectional: e.data.bidirectional },
            pathOptions: { offset: e.data.offset ?? 50 },
        };
    });
};
