import { ConnectionEdge } from "@/app/viewModels/GraphViewModel";
import defaultEdges from "../default-value/defaultEdges";

const LOCAL_STORAGE_KEY = "edges";

export const GraphService = {
    getEdges(): ConnectionEdge[] {
        if (typeof window === "undefined") return [];
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!stored) {
            this.setEdges(defaultEdges);
        }
        return stored ? JSON.parse(stored) : [];
    },

    setEdges(edges: ConnectionEdge[]): void {
        if (typeof window !== "undefined") {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(edges));
        }
    },
};
