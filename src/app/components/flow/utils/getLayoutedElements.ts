import dagre from "@dagrejs/dagre";
import { Edge, Node } from "@xyflow/react";

interface LayoutedElementReturn {
    layoutedNodes: Node[];
    structuralEdges: Edge[];
}

export const getLayoutedElements = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    nodes: any[],
    structuralEdges: Edge[],
    direction = "LR",
    nodeWidth: number,
    nodeHeight: number
): LayoutedElementReturn => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    const isHorizontal = direction === "LR";
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
        const height = node.data.type.startsWith("template") ? 12 : nodeHeight;
        dagreGraph.setNode(node.id, { width: nodeWidth, height: height });
    });

    structuralEdges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        return {
            ...node,
            targetPosition: isHorizontal ? "left" : "top",
            sourcePosition: isHorizontal ? "right" : "bottom",
            position: {
                x: nodeWithPosition.x - nodeWidth / 2,
                y: nodeWithPosition.y - nodeHeight / 2,
            },
        };
    }) as Node[];

    return { layoutedNodes, structuralEdges };
};
