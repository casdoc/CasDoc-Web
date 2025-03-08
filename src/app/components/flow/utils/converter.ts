import { NodeItems } from "../demo-data/NodeItems";

export const convertDataToNodes = (data: NodeItems[]) => {
    const defaultPosition = { x: 0, y: 0 };
    return data
        .filter((item) => {
            if (typeof item.content === "string") {
                return item.content.trim() !== "";
            }
            return true;
        })
        .map((item) => ({
            id: item.id.toString(),
            position: defaultPosition,
            data: { label: item.content },
            type: "custom",
        }));
};

export const convertDataToStructuralEdges = (data: NodeItems[]) => {
    const edges = [];
    if (data.length > 0) {
        for (let i = 1; i < data.length; i++) {
            edges.push({
                id: `e-${data[i].parentId}-${data[i].id}`,
                source: data[i].parentId!.toString(),
                target: data[i].id.toString(),
                arrowHeadType: "arrowclosed",
            });
        }
    }
    return edges;
};
