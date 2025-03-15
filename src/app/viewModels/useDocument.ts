import { useState, useEffect } from "react";
import { Document } from "@/app/models/entity/Document";
import { DocumentService } from "@/app/models/services/DocumentService";
import { DocumentType } from "@/app/models/enum/DocumentType";
import { JsonObject } from "../models/types/JsonObject";

export interface GraphNode {
    id: string;
    pid: string;
    label: string;
}

export interface EditNode {
    id: string;
    name: string;
    fields?: Array<JsonObject>;
}

export interface DocumentViewModel {
    document: Document | undefined;
    updateDocument: (document: Document) => void;
    graphNodes: Array<GraphNode>;
    editNodes: Array<EditNode>;
}

export function useDocumentViewModel(documentId: string): DocumentViewModel {
    const [document, setDocument] = useState<Document>();
    const [graphNodes, setGraphNodes] = useState<Array<GraphNode>>([]);
    const [editNodes, setEditNodes] = useState<Array<EditNode>>([]);

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

        const newGraphNodes = [];
        const newEditNodes = [];
        for (let i = 0; i < content.length; i++) {
            console.log(content[i].attrs);
            const graphNode = newGraphNode(content[i]);
            if (graphNode) newGraphNodes.push(graphNode);
            if (
                content[i].type.startsWith("topic") ||
                content[i].type.startsWith("template")
            ) {
                const editNode = newEditNode(content[i].attrs);
                if (editNode) newEditNodes.push(editNode);
            }
        }
        setGraphNodes(newGraphNodes);
        setEditNodes(newEditNodes);
    }, [document]);

    const updateDocument = (document: Document) => {
        DocumentService.saveDocument(document);
        const doc = DocumentService.getDocumentById(document.id);
        if (doc) setDocument(doc);
    };

    const newEditNode = (content: JsonObject) => {
        const editNode = {
            id: content.id,
            name: content.name,
            fields: content.fields,
        };
        return editNode;
    };

    const newGraphNode = (content: JsonObject) => {
        if (content.type.startsWith("topic")) {
            const graphNode = {
                id: content.attrs.id,
                pid: content.attrs.documentId,
                label: content.attrs.name,
            };
            return graphNode;
        } else if (content.type.startsWith("template")) {
            const graphNode = {
                id: content.attrs.id,
                pid: content.attrs.topicId,
                label: content.attrs.name,
            };
            return graphNode;
        }
    };

    return {
        document,
        updateDocument,
        graphNodes,
        editNodes,
    };
}
