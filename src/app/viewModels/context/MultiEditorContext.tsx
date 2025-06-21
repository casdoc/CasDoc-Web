import React, { createContext, useContext } from "react";
import {
    useMultiEditor,
    MultiEditorViewModel,
} from "@/app/viewModels/useMultiEditor";

const MultiEditorContext = createContext<MultiEditorViewModel | null>(null);

export const MultiEditorProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const multiEditor = useMultiEditor();
    return (
        <MultiEditorContext.Provider value={multiEditor}>
            {children}
        </MultiEditorContext.Provider>
    );
};

export const useMultiEditorContext = (): MultiEditorViewModel => {
    const ctx = useContext(MultiEditorContext);
    if (!ctx) {
        throw new Error(
            "useMultiEditorContext must be used within a MultiEditorProvider"
        );
    }
    return ctx;
};
