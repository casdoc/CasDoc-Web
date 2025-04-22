const LOCAL_STORAGE_KEY = "SELECTED_DOC";

export const DocSelectedService = {
    getSelectedDoc(): string {
        if (typeof window === "undefined") return "";
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        return stored ? JSON.parse(stored) : "";
    },
    setSelectedDoc(documentId: string): void {
        if (typeof window !== "undefined") {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(documentId));
        }
    },
};
