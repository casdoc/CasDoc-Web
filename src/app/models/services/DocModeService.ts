import DocMode from "../enum/DocMode";

const LOCAL_STORAGE_KEY = "DOC_MODE";

export const DocModeService = {
    getDocMode(): DocMode {
        if (typeof window === "undefined") return DocMode.Edit;
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        return stored ? JSON.parse(stored) : DocMode.Edit;
    },
    setDocMode(mode: DocMode): void {
        if (typeof window !== "undefined") {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mode));
        }
    },
};
