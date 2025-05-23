import { useState, useCallback, useEffect } from "react";
import { GraphService } from "../models/services/GraphService";
import { JsonObject } from "../models/types/JsonObject";
import { useProjectContext } from "./context/ProjectContext";
import { useDocumentQuery } from "./hooks/useDocumentQuery";
import z from "zod";
import { useEditorContext } from "./context/EditorContext";
import { Node } from "@tiptap/pm/model";

export interface GraphViewModel {
    connectionEdges: ConnectionEdge[];
    affectedIds: string[];
    attachedDocs: AttachedDoc[];

    // Edge actions
    updConnectionEdges: (edge: ConnectionEdge) => void;
    searchTarget: (sourceId: string) => ConnectionEdge[];
    searchSource: (sourceId: string) => ConnectionEdge[];
    removeConnectionEdge: (edge: ConnectionEdge) => void;
    updateLabel: (edge: ConnectionEdge, content: string) => void;
    updateAffectedIds: (ids: string[]) => void;
    removeAffectedId: (id: string) => void;
    clearAffectedIds: () => void;
    updateOffset: (edge: ConnectionEdge, offset: number) => void;

    // Graph actions
    appendAttachedDocs: (doc: AttachedDoc) => void;
    removeAttachedDoc: (documentId: string) => void;
    setAttachedDocs: (docs: AttachedDoc[]) => void;
    parseAttachedDocsToNodes: () => GraphNode[];
    appendAttachedDocsById: (documentId: string) => void;
    initGraphNodes: () => void;

    // Node actions
    updateNodeById: (nodeId: string, changes: Partial<JsonObject>) => void;
}

interface AttachedDoc {
    id: string;
    nodes: Array<GraphNode>;
}

export interface GraphNode {
    id: string;
    pid: string;
    label: string;
    type: string;
    level?: string;
    config?: JsonObject;
    fields?: JsonObject;
}

export interface ConnectionEdge {
    source: string;
    target: string;
    label?: string;
    data: JsonObject;
}

export function useGraphViewModel(): GraphViewModel {
    const uuidSchema = z.uuid({ version: "v4" });
    const [connectionEdges, setConnectionEdges] = useState<ConnectionEdge[]>(
        []
    );

    const { selectedDocumentId } = useProjectContext();

    const [affectedIds, setAffectedIds] = useState<string[]>([]);
    const [attachedDocs, setAttachedDocs] = useState<Array<AttachedDoc>>([]);
    const { data: document, isLoading: isDocumentLoading } = useDocumentQuery(
        selectedDocumentId,
        selectedDocumentId !== null &&
            !uuidSchema.safeParse(selectedDocumentId).success
    );
    const { editor, docContent } = useEditorContext();

    useEffect(() => {
        const localEdges = GraphService.getEdges();
        setConnectionEdges(localEdges);

        const localAffectedIds = GraphService.getAffectedIds();
        setAffectedIds(localAffectedIds);
    }, []);

    const updConnectionEdges = useCallback((edge: ConnectionEdge) => {
        setConnectionEdges((prevEdges) => {
            const exists = prevEdges.some(
                (e) => e.source === edge.source && e.target === edge.target
            );
            const reversedExists = prevEdges.some(
                (e) => e.source === edge.target && e.target === edge.source
            );

            if (exists) return prevEdges;

            if (reversedExists) {
                const newEdges = prevEdges.map((e) => {
                    if (e.source === edge.target && e.target === edge.source) {
                        return {
                            ...e,
                            data: {
                                ...e.data,
                                bidirectional: true,
                                offset: e.data.offset ?? 50,
                            },
                        };
                    }
                    return e;
                });
                GraphService.setEdges(newEdges);
                return newEdges;
            }

            const newEdges = [...prevEdges, edge];
            GraphService.setEdges(newEdges);
            return newEdges;
        });
    }, []);

    const searchTarget = (id: string): ConnectionEdge[] => {
        return connectionEdges
            .filter(
                (e) =>
                    e.source === id ||
                    (e.target === id && e.data?.bidirectional)
            )
            .map((e) => {
                if (e.target === id && e.data?.bidirectional) {
                    return { ...e, source: e.target, target: e.source };
                }
                return e;
            });
    };

    const searchSource = (id: string): ConnectionEdge[] => {
        return connectionEdges
            .filter(
                (e) =>
                    e.target === id ||
                    (e.source === id && e.data?.bidirectional)
            )
            .map((e) => {
                if (e.source === id && e.data?.bidirectional) {
                    return { ...e, source: e.target, target: e.source };
                }
                return e;
            });
    };

    const removeConnectionEdge = (edge: ConnectionEdge) => {
        setConnectionEdges((prevEdges) => {
            if (!edge.data?.bidirectional) {
                const newEdges = prevEdges.filter(
                    (e) =>
                        !(e.source === edge.source && e.target === edge.target)
                );
                GraphService.setEdges(newEdges);
                return newEdges;
            }
            const newEdges = prevEdges.map((e) => {
                if (e.target === edge.source && e.source === edge.target) {
                    return {
                        ...e,
                        data: { ...e.data, bidirectional: false },
                    };
                }
                if (e.target === edge.target && e.source === edge.source) {
                    return {
                        ...e,
                        source: e.target,
                        target: e.source,
                        data: { ...e.data, bidirectional: false },
                    };
                }
                return e;
            });
            GraphService.setEdges(newEdges);
            return newEdges;
        });
    };

    const updateLabel = (edge: ConnectionEdge, content: string) => {
        setConnectionEdges((prevEdges) => {
            const newEdges = prevEdges.map((e) => {
                if (
                    (e.source === edge.source && e.target === edge.target) ||
                    (e.source == edge.target &&
                        e.target === edge.source &&
                        e.data.bidirectional)
                ) {
                    return { ...e, label: content };
                }
                return e;
            });
            GraphService.setEdges(newEdges);
            return newEdges;
        });
    };

    const updateAffectedIds = useCallback((ids: string[]) => {
        setAffectedIds((prevIds) => {
            const newIds = Array.from(new Set([...prevIds, ...ids]));
            GraphService.setAffectedIds(newIds);
            return newIds;
        });
    }, []);

    const removeAffectedId = useCallback((id: string) => {
        setAffectedIds((prevIds) => {
            const newIds = prevIds.filter((prevId) => prevId !== id);
            GraphService.setAffectedIds(newIds);
            return newIds;
        });
    }, []);

    const clearAffectedIds = useCallback(() => {
        setAffectedIds([]);
        GraphService.setAffectedIds([]);
    }, []);

    const updateOffset = (edge: ConnectionEdge, offset: number) => {
        setConnectionEdges((prevEdges) => {
            const newEdges = prevEdges.map((e) => {
                if (
                    (e.source === edge.source && e.target === edge.target) ||
                    (e.source == edge.target &&
                        e.target === edge.source &&
                        e.data.bidirectional)
                ) {
                    return { ...e, data: { ...e.data, offset: offset } };
                }
                return e;
            });
            GraphService.setEdges(newEdges);
            return newEdges;
        });
    };

    const removeAttachedDoc = (documentId: string) => {
        setAttachedDocs((prevDocs) => {
            const newDocs = prevDocs.filter((doc) => doc.id !== documentId);
            return newDocs;
        });
    };

    const appendAttachedDocs = useCallback((doc: AttachedDoc) => {
        setAttachedDocs((prevDocs) => {
            const newDocs = [...prevDocs, doc];
            return newDocs;
        });
    }, []);

    const parseAttachedDocsToNodes = () => {
        const nodes: GraphNode[] = [];
        attachedDocs.forEach((doc) => {
            doc.nodes.forEach((node) => {
                nodes.push(node);
            });
        });
        return nodes;
    };

    const updateAttachedDocById = useCallback(
        (documentId: string): AttachedDoc | undefined => {
            if (!document || !selectedDocumentId) return;

            const newGraphNodes: GraphNode[] = [
                {
                    id: document.id,
                    pid: document.id,
                    label: document.title || "Untitled",
                    type: "root",
                },
            ];
            const lastTopicId: string[] = [
                document.id,
                document.id,
                document.id,
            ];
            let lastTopicLevel = 0;
            const content = docContent?.doc?.content || [];

            for (let i = 0; i < content.length; i++) {
                const topicLevel: number =
                    parseInt(content[i].attrs.level) ?? 0;
                let parent = lastTopicLevel;

                if (topicLevel === 1) parent = 0;
                else if (topicLevel === lastTopicLevel)
                    parent = lastTopicLevel - 1;
                else if (topicLevel < lastTopicLevel) parent = topicLevel - 1;

                if (content[i].type.startsWith("topic")) {
                    lastTopicId[topicLevel] = content[i].attrs.id;
                    lastTopicLevel = topicLevel;
                }

                const graphNode = newGraphNode(content[i], lastTopicId[parent]);
                if (graphNode) newGraphNodes.push(graphNode);
            }

            const attachedDoc = {
                id: documentId,
                nodes: newGraphNodes,
            };
            return attachedDoc;
        },
        [docContent, document, selectedDocumentId]
    );

    const appendAttachedDocsById = useCallback(
        (documentId: string) => {
            const attachedDoc = updateAttachedDocById(documentId);
            if (attachedDoc) {
                appendAttachedDocs(attachedDoc);
            }
        },
        [appendAttachedDocs, updateAttachedDocById]
    );

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

    const initGraphNodes = () => {
        if (selectedDocumentId && attachedDocs.length === 0) {
            appendAttachedDocsById(selectedDocumentId);
        }
    };

    const updateNodeById = (nodeId: string, changes: Partial<JsonObject>) => {
        const updatedDocs = attachedDocs.map((doc) => {
            let pos = 0;
            const updatedNode = doc.nodes.find((n, idx) => {
                if (n.id === nodeId) {
                    pos = idx;
                    return true;
                }
                return false;
            });
            if (updatedNode) {
                const updatedNodes = doc.nodes;
                updatedNodes[pos] = {
                    ...doc.nodes[pos],
                    ...changes,
                };
                saveModifiedToDoc(nodeId, updatedNodes[pos]);
                return { ...doc, nodes: updatedNodes };
            }
            return doc;
        });
        setAttachedDocs(updatedDocs);
    };

    const saveModifiedToDoc = (nodeId: string, updatedNode: GraphNode) => {
        if (!document || !editor) return;
        const oldContent = docContent?.doc?.content || [];
        const newContent = oldContent.map((item: Node) => {
            if (item?.attrs?.id === nodeId) {
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
        editor?.commands.setContent(newContent);
    };

    // update the current document's nodes data when modifying in edit panel
    useEffect(() => {
        if (!document || isDocumentLoading || !selectedDocumentId || !editor)
            return;
        const newDoc = updateAttachedDocById(selectedDocumentId);
        if (!newDoc) return;
        setAttachedDocs((docs) => {
            const newDocs = docs;
            newDocs[0] = newDoc;
            return [...newDocs];
        });
    }, [
        editor,
        document,
        updateAttachedDocById,
        selectedDocumentId,
        isDocumentLoading,
    ]);

    return {
        connectionEdges,
        affectedIds,
        attachedDocs,

        // Edge actions
        updConnectionEdges,
        searchTarget,
        searchSource,
        removeConnectionEdge,
        updateLabel,
        updateAffectedIds,
        removeAffectedId,
        clearAffectedIds,
        updateOffset,

        //Graph actions
        appendAttachedDocs,
        removeAttachedDoc,
        setAttachedDocs,
        parseAttachedDocsToNodes,
        appendAttachedDocsById,
        initGraphNodes,

        // Node actions
        updateNodeById,
    };
}
