import { useState, useEffect } from "react";
import { Document } from "@/app/models/entity/Document";
import { DocumentService } from "@/app/models/services/DocumentService";
import { DocumentType } from "@/app/models/enum/DocumentType";
import { v4 as uuidv4 } from "uuid";
import { get } from "lodash";
import { JsonObject } from "@/app/models/types/JsonObject";

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
                []
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
    const getNodes = (documentId: string) => {
        const content = getDocumentById(documentId)?.getContent();
        console.debug("content", content);
        if (!content) return [];
        const ret = [];
        for (let i = 0; i < content.length; i++) {
            console.debug("content[i]", content[i]);
            if (content[i].type.startsWith("topic")) {
                ret.push({
                    id: content[i].attrs.id,
                    pid: content[i].attrs.documentId,
                    label: content[i].attrs.name,
                });
            } else if (content[i].type.startsWith("template")) {
                ret.push({
                    id: content[i].attrs.id,
                    pid: content[i].attrs.topicId,
                    label: content[i].attrs.name,
                });
            }
        }
        return ret;
    };

    return {
        documents,
        getDocumentById,
        addDocument,
        updateDocument,
        getNodes,
    };
}
