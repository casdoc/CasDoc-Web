import dagre from "@dagrejs/dagre";
import { Edge, Node } from "@xyflow/react";

interface LayoutedElementReturn {
    layoutedNodes: Node[];
    structuralEdges: Edge[];
}

export const getLayoutedElements = (
    nodes: Node[],
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
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
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
