const LOCAL_STORAGE_KEY = "docContent";

export const DocContentModel = {
    getContent(): string {
        if (typeof window === "undefined") {
            return "";
        }
        return localStorage.getItem(LOCAL_STORAGE_KEY) || "";
    },

    setContent(content: string): void {
        if (typeof window !== "undefined") {
            localStorage.setItem(LOCAL_STORAGE_KEY, content);
        }
    },
};
