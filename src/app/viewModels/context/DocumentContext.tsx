import { createContext, useContext, ReactNode } from "react";
import { DocumentViewModel, useDocumentViewModel } from "../useDocument";

const DocumentContext = createContext<DocumentViewModel | undefined>(undefined);

export function DocumentProvider({
    children,
    documentId,
}: {
    children: ReactNode;
    documentId: string;
}) {
    const documentViewModel = useDocumentViewModel(documentId);
    return (
        <DocumentContext.Provider value={documentViewModel}>
            {children}
        </DocumentContext.Provider>
    );
}

export function useDocumentContext(): DocumentViewModel {
    const context = useContext(DocumentContext);
    if (context === undefined) {
        throw new Error(
            "useDocumentContext must be used within a DocumentProvider"
        );
    }
    return context;
}
