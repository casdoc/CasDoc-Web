import { MarkerType, Position } from "@xyflow/react";

export const convertDataToNodes = (data: any) => {
    const defaultPosition = { x: 0, y: 0 };
    return data.map((item: any) => ({
        id: `${item.id}`,
        position: defaultPosition,
        data: { label: item.attrs.content || "empty" },
        type: "custom",
    }));
};

export const convertDataToStructuralEdges = (data: any) => {
    const edges = [];

    // tree structure edges
    if (data.length > 0) {
        for (let i = 1; i < data.length; i++) {
            edges.push({
                id: `e-${data[i].attrs.parent}-${data[i].id}`,
                source: `${data[i].attrs.parent}`,
                target: `${data[i].id}`,
                arrowHeadType: MarkerType.ArrowClosed,
                type: "bazier",
            });
        }
    }
    return edges;
};

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
                type: "smoothstep",
                targetHandle: Position.Right,
            });
        }
    }
    return edges;
};
