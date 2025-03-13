import { ConnectionEdge } from "@/app/viewModels/GraphViewModel";

const LOCAL_STORAGE_KEY = "edges";

export const GraphService = {
    getEdges(): ConnectionEdge[] {
        if (typeof window === "undefined") return [];
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    },

    setEdges(edges: ConnectionEdge[]): void {
        if (typeof window !== "undefined") {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(edges));
        }
    },
};
