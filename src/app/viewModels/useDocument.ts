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
}

export interface DocumentViewModel {
    document: Document | undefined;
    updateDocument: (document: Document) => void;
    updateEditNodeById: (nodeId: string, changes: Partial<JsonObject>) => void;
    graphNodes: Array<GraphNode>;
    editNodes: Array<JsonObject>;
}

export function useDocumentViewModel(documentId: string): DocumentViewModel {
    const [document, setDocument] = useState<Document>();
    const [graphNodes, setGraphNodes] = useState<Array<GraphNode>>([
        {
            id: "root",
            pid: "root",
            label: "root",
            type: "",
        },
    ]);
    const [editNodes, setEditNodes] = useState<Array<JsonObject>>([]);

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

    useEffect(() => {
        if (!document) return;

        const content = document.getContent();

        if (!content) {
            setGraphNodes([
                {
                    id: "root",
                    pid: "root",
                    label: document.getTitle() || "Untitled",
                    type: "",
                },
            ]);
            return;
        }
        const firstChild = content[0];

        if (!firstChild || !firstChild?.content) {
            document.setTitle("Untitled Document");
        } else {
            document.setTitle(firstChild.content[0].text);
        }

        const newGraphNodes: GraphNode[] = [];
        const newEditNodes: JsonObject[] = [];
        let lastTopicId: string | undefined = undefined;

        for (let i = 0; i < content.length; i++) {
            if (content[i].type.startsWith("topic")) {
                lastTopicId = content[i].attrs.id;
            }

            const graphNode = newGraphNode(content[i], lastTopicId);
            if (graphNode) newGraphNodes.push(graphNode);

            if (
                content[i].type.startsWith("topic") ||
                content[i].type.startsWith("template")
            ) {
                const editNode = newEditNode(content[i].type, content[i].attrs);
                if (editNode) newEditNodes.push(editNode);
            }
        }

        setGraphNodes([
            {
                id: "root",
                pid: "root",
                label: document.getTitle() || "Untitled",
                type: "",
            },
            ...newGraphNodes,
        ]);
        setEditNodes(newEditNodes);
    }, [document]);

    const updateDocument = useCallback((document: Document) => {
        DocumentService.saveDocument(document);
        const doc = DocumentService.getDocumentById(document.id);
        if (doc) {
            setDocument(doc);
        }
    }, []);

    const updateEditNodeById = (
        nodeId: string,
        changes: Partial<JsonObject>
    ) => {
        if (!document) return;

        const updatedEditNodes = editNodes.map((node) =>
            node.id === nodeId ? { ...node, ...changes } : node
        );
        setEditNodes(updatedEditNodes);

        const oldContent = document.getContent() || [];
        const newContent = oldContent.map((item) => {
            if (item?.attrs?.id === nodeId) {
                const updatedNode = updatedEditNodes.find(
                    (n) => n.id === nodeId
                );
                return {
                    ...item,
                    attrs: {
                        ...item.attrs,
                        name: updatedNode?.config.name,
                        fields: updatedNode?.fields,
                        config: updatedNode?.config,
                    },
                };
            }
            return item;
        });

        document.setAllContent(newContent);
        updateDocument(document);
    };

    const newEditNode = (type: string, content: JsonObject) => {
        const editNode = {
            id: content.id,
            type: type,
            config: content.config,
            fields: content.fields,
        };
        return editNode;
    };

    const newGraphNode = (content: JsonObject, lastTopicId?: string) => {
        if (content.type.startsWith("topic")) {
            return {
                id: content.attrs.id,
                pid: "root",
                label: content.attrs.config?.info.name || "",
                type: content.type,
            };
        } else if (content.type.startsWith("template")) {
            return {
                id: content.attrs.id,
                pid: lastTopicId || content.attrs.topicId,
                label: content.attrs.config?.info?.name || "",
                type: content.type,
            };
        }
    };

    return {
        document,
        updateDocument,
        updateEditNodeById,
        graphNodes,
        editNodes,
    };
}
