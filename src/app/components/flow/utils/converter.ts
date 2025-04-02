import { MarkerType, Position } from "@xyflow/react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const convertDataToNodes = (data: any) => {
    const defaultPosition = { x: 0, y: 0 };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((item: any) => ({
        id: `${item.id}`,
        position: defaultPosition,
        data: {
            label: item.label || "unknown",
            type: item.type,
        },
        type: "custom",
        deletable: false,
    }));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const convertDataToStructuralEdges = (data: any) => {
    const edges = [];

    // tree structure edges
    if (data.length > 0) {
        for (let i = 1; i < data.length; i++) {
            edges.push({
                id: `e-${data[i].pid}-${data[i].id}`,
                source: `${data[i].pid}`,
                target: `${data[i].id}`,
                arrowHeadType: MarkerType.ArrowClosed,
                type: "default",
                deletable: false,
                selectable: false,
            });
        }
    }
    return edges;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const connectConnectionEdges = (connectionEdges: any) => {
    const edges = [];

    // component connection edges
    if (connectionEdges.length > 0) {
        for (let i = 0; i < connectionEdges.length; i++) {
            edges.push({
                id: `e-${connectionEdges[i].source}-${connectionEdges[i].target}`,
                source: `${connectionEdges[i].source}`,
                target: `${connectionEdges[i].target}`,
                arrowHeadType: MarkerType.ArrowClosed,
                type: "custom",
                targetHandle: Position.Right,
                label: connectionEdges[i].label,
            });
        }
    }
    return edges;
};
