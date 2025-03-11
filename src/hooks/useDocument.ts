import { useState, useEffect } from "react";
import { Document } from "@/app/models/entity/Document";
import { DocumentService } from "@/app/models/services/DocumentService";
import { DocumentType } from "@/app/models/enum/DocumentType";
interface NodeInfo {
    id: string;
    pid: string;
    label: string;
}
export function useDocumentViewModel(documentId: string) {
    const [document, setDocument] = useState<Document>();
    const [graphNodes, setGraphNodes] = useState<Array<NodeInfo>>([]);

    useEffect(() => {
        let doc = DocumentService.getDocumentById(documentId);
        if (!doc) {
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
            doc = emptyDoc;
        }

        setDocument(doc);
    }, [documentId]);
    useEffect(() => {
        if (!document) return;

        const content = document.getContent();
        console.debug("content", content);
        if (!content) {
            setGraphNodes([]);
            return;
        }

        const newNodes = [];
        for (let i = 0; i < content.length; i++) {
            console.debug("content[i]", content[i]);
            if (content[i].type.startsWith("topic")) {
                newNodes.push({
                    id: content[i].attrs.id,
                    pid: content[i].attrs.documentId,
                    label: content[i].attrs.name,
                });
            } else if (content[i].type.startsWith("template")) {
                newNodes.push({
                    id: content[i].attrs.id,
                    pid: content[i].attrs.topicId,
                    label: content[i].attrs.name,
                });
            }
        }
        setGraphNodes(newNodes);
    }, [document]);
    const updateDocument = (document: Document) => {
        DocumentService.saveDocument(document);
        const doc = DocumentService.getDocumentById(document.id);
        if (doc) setDocument(doc);
    };

    return {
        document,
        updateDocument,
        graphNodes,
    };
}
