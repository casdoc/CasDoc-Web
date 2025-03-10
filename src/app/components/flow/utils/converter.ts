import { MarkerType } from "@xyflow/react";
import { NodeItem } from "../demo-data/NodeItems";

export const convertDataToNodes = (data: any) => {
    const defaultPosition = { x: 0, y: 0 };
    // return data
    //     .filter((item: any) => {
    //         if (typeof item.content === "string") {
    //             return item.content.trim() !== "";
    //         }
    //         return true;
    //     })
    //     .map((item: any) => ({
    //         id: item.id.toString(),
    //         position: defaultPosition,
    //         data: { label: item.content },
    //         type: "custom",
    //     }));
    return data.map((item: any) => ({
        id: `${item.id}`,
        position: defaultPosition,
        data: { label: item.type },
        type: "custom",
    }));
};

export const convertDataToStructuralEdges = (data: any) => {
    const edges = [];
    if (data.length > 0) {
        for (let i = 1; i < data.length; i++) {
            // edges.push({
            //     id: `e-${data[i].parentId}-${data[i].id}`,
            //     source: data[i].parentId!.toString(),
            //     target: data[i].id.toString(),
            //     arrowHeadType: "arrowclosed",
            //     type: "default",
            // });
            edges.push({
                id: `e-${data[i].attrs.parent}-${data[i].id}`,
                source: `${data[i].attrs.parent}`,
                target: `${data[i].id}`,
                arrowHeadType: MarkerType.ArrowClosed,
                type: "default",
            });
        }
    }
    return edges;
};
