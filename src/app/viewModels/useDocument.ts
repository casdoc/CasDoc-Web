import { useState, useEffect, useCallback } from "react";
import { Document } from "@/app/models/entity/Document";
import { DocumentService } from "@/app/models/services/DocumentService";
import { DocumentType } from "@/app/models/enum/DocumentType";
import { JsonObject } from "../models/types/JsonObject";
import defaultContent from "../models/default-value/defaultContent";

export interface GraphNode {
    id: string;
    pid: string;
    label: string;
    type: string;
    level?: string;
    config?: JsonObject;
    fields?: JsonObject;
}

export interface DocumentViewModel {
    document: Document | undefined;
    updateDocument: (document: Document) => void;
}

export function useDocumentViewModel(documentId: string): DocumentViewModel {
    const [document, setDocument] = useState<Document>();

    useEffect(() => {
        let doc = DocumentService.getDocumentById(documentId);
        if (!doc) {
            const emptyDoc = new Document(
                "default-document",
                new Date(),
                new Date(),
                DocumentType.SRD,
                "default-project",
                "Untitled Document",
                "No description",
                defaultContent
            );
            DocumentService.saveDocument(emptyDoc);
            doc = emptyDoc;
        }
        setDocument(doc);
    }, [documentId]);

    const updateDocument = useCallback((document: Document) => {
        DocumentService.saveDocument(document);
        const doc = DocumentService.getDocumentById(document.id);
        if (doc) {
            setDocument(doc);
        }
    }, []);

    return {
        document,
        updateDocument,
    };
}
