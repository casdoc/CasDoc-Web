const LOCAL_STORAGE_KEY = "edges";

export const GraphService = {
    getEdges(): any {
        if (typeof window === "undefined") return [];
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    },
    setEdges(edges: any): void {
        if (typeof window !== "undefined") {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(edges));
        }
    },
};
