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
    graphNodes: Array<GraphNode>;
    updateDocument: (document: Document) => void;
    updateEditNodeById: (nodeId: string, changes: Partial<JsonObject>) => void;
}

export function useDocumentViewModel(documentId: string): DocumentViewModel {
    const [document, setDocument] = useState<Document>();
    const [graphNodes, setGraphNodes] = useState<Array<GraphNode>>([]);

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

        const content = document.content;

        if (!content) {
            setGraphNodes([
                {
                    id: documentId,
                    pid: documentId,
                    label: document.title || "Untitled",
                    type: "root",
                },
            ]);
            return;
        }
        const firstChild = content[0];

        if (!firstChild || !firstChild?.content) {
            document.title = "Untitled Document";
        } else {
            document.title = firstChild.content[0].text;
        }

        const newGraphNodes: GraphNode[] = [
            {
                id: documentId,
                pid: documentId,
                label: document.title || "Untitled",
                type: "root",
            },
        ];
        const lastTopicId: string[] = [documentId, documentId, documentId];
        let lastTopicLevel = 0;

        for (let i = 0; i < content.length; i++) {
            const topicLevel: number = parseInt(content[i].attrs.level) ?? 0;
            let parent = lastTopicLevel;
            if (topicLevel === 1) parent = 0;
            else if (topicLevel === lastTopicLevel) parent = lastTopicLevel - 1;
            else if (topicLevel < lastTopicLevel) parent = topicLevel - 1;

            if (content[i].type.startsWith("topic")) {
                lastTopicId[topicLevel] = content[i].attrs.id;
                lastTopicLevel = topicLevel;
            }
            const graphNode = newGraphNode(content[i], lastTopicId[parent]);
            if (graphNode) newGraphNodes.push(graphNode);
        }
        if (JSON.stringify(newGraphNodes) !== JSON.stringify(graphNodes)) {
            setGraphNodes(newGraphNodes);
        }
    }, [document, graphNodes, documentId]);

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

        const updatedEditNodes = graphNodes.map((node) =>
            node.id === nodeId ? { ...node, ...changes } : node
        );
        setGraphNodes(updatedEditNodes);

        const oldContent = document.content || [];
        const newContent = oldContent.map((item) => {
            if (item?.attrs?.id === nodeId) {
                const updatedNode = updatedEditNodes.find(
                    (n) => n.id === nodeId
                );
                return {
                    ...item,
                    attrs: {
                        ...item.attrs,
                        name: updatedNode?.config?.name,
                        fields: updatedNode?.fields,
                        config: updatedNode?.config,
                    },
                };
            }
            return item;
        });

        document.content = newContent;
        updateDocument(document);
    };

    const newGraphNode = (content: JsonObject, lastTopicId?: string) => {
        if (
            content.type.startsWith("topic") ||
            content.type.startsWith("template")
        ) {
            return {
                id: content.attrs.id,
                pid: lastTopicId || content.attrs.topicId,
                label: content.attrs.config?.info.name || "",
                type: content.type,
                level: content.attrs.level,
                config: content.attrs.config,
                fields: content.attrs.fields,
            };
        }
    };

    return {
        document,
        graphNodes,
        updateDocument,
        updateEditNodeById,
    };
}
