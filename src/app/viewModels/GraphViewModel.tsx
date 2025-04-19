import { useState, useCallback, useEffect } from "react";
import { GraphService } from "../models/services/GraphService";
import { JsonObject } from "../models/types/JsonObject";
import { GraphNode } from "./useDocument";

export interface GraphViewModel {
    connectionEdges: ConnectionEdge[];
    affectedIds: string[];
    graphNodes: Array<GraphNode>;
    updConnectionEdges: (edge: ConnectionEdge) => void;
    searchTarget: (sourceId: string) => ConnectionEdge[];
    searchSource: (sourceId: string) => ConnectionEdge[];
    removeConnectionEdge: (edge: ConnectionEdge) => void;
    updateLabel: (edge: ConnectionEdge, content: string) => void;
    updateAffectedIds: (ids: string[]) => void;
    removeAffectedId: (id: string) => void;
    clearAffectedIds: () => void;
    updateOffset: (edge: ConnectionEdge, offset: number) => void;
    appendGraphNodes: (nodes: Array<GraphNode>) => void;
    setGraphNodes: (nodes: Array<GraphNode>) => void;
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
    const [graphNodes, setGraphNodes] = useState<Array<GraphNode>>([
        {
            id: "root",
            pid: "root",
            label: "root",
            type: "",
        },
    ]);

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

    const appendGraphNodes = useCallback((nodes: Array<GraphNode>) => {
        setGraphNodes((prevNodes) => {
            const newNodes = [...prevNodes, ...nodes];
            return newNodes;
        });
    }, []);

    return {
        connectionEdges,
        affectedIds,
        graphNodes,
        updConnectionEdges,
        searchTarget,
        searchSource,
        removeConnectionEdge,
        updateLabel,
        updateAffectedIds,
        removeAffectedId,
        clearAffectedIds,
        updateOffset,
        appendGraphNodes,
        setGraphNodes,
    };
}
