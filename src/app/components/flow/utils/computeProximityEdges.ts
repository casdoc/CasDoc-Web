import { MarkerType } from "@xyflow/react";

export const computeProximityEdges = (
    nodes: any[],
    threshold: number = 200
) => {
    if (!nodes || nodes.length === 0) return [];
    const parent = nodes[0];
    const proxEdges = [];
    for (let i = 1; i < nodes.length; i++) {
        const dx = parent.position.x - nodes[i].position.x;
        const dy = parent.position.y - nodes[i].position.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < threshold) {
            proxEdges.push({
                id: `e-${parent.id}-${nodes[i].id}`,
                source: parent.id,
                target: nodes[i].id,
                arrowHeadType: MarkerType.ArrowClosed,
                type: "smoothstep",
            });
        }
    }
    return proxEdges;
};
