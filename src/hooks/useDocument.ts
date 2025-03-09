import { useState, useEffect } from "react";
import { Document } from "@/app/models/entity/Document";
import { DocumentService } from "@/app/models/services/DocumentService";
import { DocumentType } from "@/app/models/enum/DocumentType";
import { v4 as uuidv4 } from "uuid";

export function useDocumentViewModel() {
    const [documents, setDocuments] = useState<Document[]>([]);

    useEffect(() => {
        let docs = DocumentService.getAllDocuments();
        console.debug("useDocumentViewModel", docs);
        if (docs.length === 0) {
            const emptyDoc = new Document(
                // uuidv4(),
                "default-document",
                new Date(),
                new Date(),
                DocumentType.SRD,
                "default-project",
                "Untitled Document",
                "No description",
                [
                    {
                        type: "heading",
                        attrs: { textAlign: null, level: 1 },
                        content: [{ type: "text", text: "" }],
                    },
                ]
            );
            DocumentService.saveDocument(emptyDoc);
            docs = [emptyDoc];
        }

        setDocuments(docs);
    }, []);

    const getDocumentById = (id: string) => {
        return documents.find((doc) => doc.id === id);
    };

    const addDocument = (document: Document) => {
        DocumentService.saveDocument(document);
        setDocuments(DocumentService.getAllDocuments());
    };

    const updateDocument = (document: Document) => {
        DocumentService.saveDocument(document);
        setDocuments(DocumentService.getAllDocuments());
    };

    return {
        documents,
        getDocumentById,
        addDocument,
        updateDocument,
    };
}
