import { useState, useCallback, useEffect } from "react";
import { GraphService } from "../models/services/GraphService";
import { JsonObject } from "../models/types/JsonObject";
import { GraphNode } from "./useDocument";
import { useProjectContext } from "./context/ProjectContext";
import { useDocumentContext } from "./context/DocumentContext";

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
    parseAttahcedDocsToNodes: () => GraphNode[];
    appendAttachedDocsById: (documentId: string) => void;
    initGraphNodes: () => void;

    // Node actions
    updateNodeById: (nodeId: string, changes: Partial<JsonObject>) => void;
}

interface AttachedDoc {
    id: string;
    nodes: Array<GraphNode>;
}

export interface ConnectionEdge {
    source: string;
    target: string;
    label?: string;
    data: JsonObject;
}

export function useGraphViewModel(): GraphViewModel {
    const [connectionEdges, setConnectionEdges] = useState<ConnectionEdge[]>(
        []
    );
    const [affectedIds, setAffectedIds] = useState<string[]>([]);
    const [attachedDocs, setAttachedDocs] = useState<Array<AttachedDoc>>([]);
    const { getDocumentById } = useProjectContext();
    const { document } = useDocumentContext();

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

    const parseAttahcedDocsToNodes = () => {
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
            const doc = getDocumentById(documentId);
            if (!doc) return;
            const docContents = doc.content;
            const newGraphNodes: GraphNode[] = [
                {
                    id: doc.id,
                    pid: doc.id,
                    label: doc.title || "Untitled",
                    type: "root",
                },
            ];
            const lastTopicId: string[] = [doc.id, doc.id, doc.id];
            let lastTopicLevel = 0;

            for (let i = 0; i < docContents.length; i++) {
                const topicLevel: number =
                    parseInt(docContents[i].attrs.level) ?? 0;
                let parent = lastTopicLevel;

                if (topicLevel === 1) parent = 0;
                else if (topicLevel === lastTopicLevel)
                    parent = lastTopicLevel - 1;
                else if (topicLevel < lastTopicLevel) parent = topicLevel - 1;

                if (docContents[i].type.startsWith("topic")) {
                    lastTopicId[topicLevel] = docContents[i].attrs.id;
                    lastTopicLevel = topicLevel;
                }

                const graphNode = newGraphNode(
                    docContents[i],
                    lastTopicId[parent]
                );
                if (graphNode) newGraphNodes.push(graphNode);
            }
            const attachedDoc = {
                id: documentId,
                nodes: newGraphNodes,
            };
            return attachedDoc;
        },
        [getDocumentById]
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

    useEffect(() => {
        for (const doc of attachedDocs) {
            updateAttachedDocById(doc.id);
        }
    }, [attachedDocs, updateAttachedDocById, document]);

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
                fields: content.attrs.fileds,
            };
        }
    };

    const { selectedDocumentId } = useProjectContext();
    const initGraphNodes = () => {
        if (selectedDocumentId && attachedDocs.length === 0) {
            appendAttachedDocsById(selectedDocumentId);
        }
    };

    const updateNodeById = (nodeId: string, changes: Partial<JsonObject>) => {
        const updatedDocs = attachedDocs.map((doc) => {
            const updatedNode = doc.nodes.find((n) => n.id === nodeId);
            if (updatedNode) {
                const updatedNodes = doc.nodes.map((n) =>
                    n.id === nodeId ? { ...n, ...changes } : n
                );
                return { ...doc, nodes: updatedNodes };
            }
            return doc;
        });
        setAttachedDocs(updatedDocs);
    };

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
        parseAttahcedDocsToNodes,
        appendAttachedDocsById,
        initGraphNodes,

        // Node actions
        updateNodeById,
    };
}
