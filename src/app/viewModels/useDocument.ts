import { useState, useEffect } from "react";
import { Document } from "@/app/models/entity/Document";
import { DocumentService } from "@/app/models/services/DocumentService";
import { DocumentType } from "@/app/models/enum/DocumentType";
import { JsonObject } from "../models/types/JsonObject";
import { useDocContext } from "./context/DocContext";
export interface GraphNode {
    id: string;
    pid: string;
    label: string;
}

export interface EditNode {
    id: string;
    type: string;
    name: string;
    fields?: Array<JsonObject>;
}

export interface DocumentViewModel {
    document: Document | undefined;
    updateDocument: (document: Document) => void;
    updateEditNodeById: (nodeId: string, changes: Partial<EditNode>) => void;
    graphNodes: Array<GraphNode>;
    editNodes: Array<EditNode>;
}

export function useDocumentViewModel(documentId: string): DocumentViewModel {
    const [document, setDocument] = useState<Document>();
    const [graphNodes, setGraphNodes] = useState<Array<GraphNode>>([
        {
            id: "root",
            pid: "root",
            label: "root",
        },
    ]);
    const [editNodes, setEditNodes] = useState<Array<EditNode>>([]);
    const { bindDocument } = useDocContext();

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

        if (!content) {
            setGraphNodes([
                {
                    id: "root",
                    pid: "root",
                    label: document.getTitle() || "Untitled",
                },
            ]);
            return;
        }
        bindDocument(document);
        const firstChild = content[0];

        if (!firstChild || !firstChild?.content) {
            document.setTitle("Untitled Document");
        } else {
            document.setTitle(firstChild.content[0].text);
        }

        const newGraphNodes: GraphNode[] = [];
        const newEditNodes: EditNode[] = [];
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
            },
            ...newGraphNodes,
        ]);
        setEditNodes(newEditNodes);
    }, [document, bindDocument]);

    const updateDocument = (document: Document) => {
        DocumentService.saveDocument(document);
        const doc = DocumentService.getDocumentById(document.id);
        if (doc) {
            setDocument(doc);
        }
    };

    const updateEditNodeById = (nodeId: string, changes: Partial<EditNode>) => {
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
                        name: updatedNode?.name,
                        fields: updatedNode?.fields,
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
            name: content.name,
            fields: content.fields,
        };
        return editNode;
    };

    const newGraphNode = (content: JsonObject, lastTopicId?: string) => {
        if (content.type.startsWith("topic")) {
            return {
                id: content.attrs.id,
                pid: "root",
                label: content.attrs.name,
            };
        } else if (content.type.startsWith("template")) {
            return {
                id: content.attrs.id,
                pid: lastTopicId || content.attrs.topicId,
                label: content.attrs.name,
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
