import { Document } from "@/app/models/entity/Document";
import { createContext, useContext, useState } from "react";

interface DocContextType {
    document: Document | null;
    bindDocument: (doc: Document) => void;
}

const DocContext = createContext<DocContextType | undefined>(undefined);

export const DocProvider = ({
    children,
}: {
    children: React.ReactNode;
    doc?: Document;
}) => {
    const [document, setDocument] = useState<Document | null>(null);

    const bindDocument = (doc: Document) => {
        setDocument(doc);
    };

    return (
        <DocContext.Provider value={{ document, bindDocument }}>
            {children}
        </DocContext.Provider>
    );
};

export const useDocContext = () => {
    const context = useContext(DocContext);
    if (!context) {
        throw new Error("useDocContext must be used within a DocumentProvider");
    }
    return context;
};
