const LOCAL_STORAGE_KEY = "edges";

export const GraphService = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getEdges(): any {
        if (typeof window === "undefined") return [];
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setEdges(edges: any): void {
        if (typeof window !== "undefined") {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(edges));
        }
    },
};
