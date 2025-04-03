import { useState, useCallback, useEffect } from "react";
import { GraphService } from "../models/services/GraphService";
import { JsonObject } from "../models/types/JsonObject";

export interface GraphViewModel {
    connectionEdges: ConnectionEdge[];
    updConnectionEdges: (edge: ConnectionEdge) => void;
    searchTarget: (sourceId: string) => ConnectionEdge[];
    searchSource: (sourceId: string) => ConnectionEdge[];
    removeConnectionEdge: (edge: ConnectionEdge) => void;
    updateLabel: (edge: ConnectionEdge, content: string) => void;
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

    useEffect(() => {
        const localEdges = GraphService.getEdges();
        setConnectionEdges(localEdges);
    }, []);

    const updConnectionEdges = useCallback((edge: ConnectionEdge) => {
        setConnectionEdges((prevEdges) => {
            const exists = prevEdges.some(
                (e) => e.source === edge.source && e.target === edge.target
            );
            if (exists) return prevEdges;

            const newEdges = [...prevEdges, edge];
            GraphService.setEdges(newEdges);
            return newEdges;
        });
    }, []);

    const searchTarget = (id: string): ConnectionEdge[] => {
        return connectionEdges.filter((edge) => edge.source === id.toString());
    };

    const searchSource = (id: string): ConnectionEdge[] => {
        return connectionEdges.filter((edge) => edge.target === id.toString());
    };

    const removeConnectionEdge = useCallback((edge: ConnectionEdge) => {
        setConnectionEdges((prevEdges) => {
            const newEdges = prevEdges.filter(
                (e) => !(e.source === edge.source && e.target === edge.target)
            );
            GraphService.setEdges(newEdges);
            return newEdges;
        });
    }, []);

    const updateLabel = (edge: ConnectionEdge, content: string) => {
        setConnectionEdges((prevEdges) => {
            const newEdges = prevEdges.map((e) => {
                if (e.source === edge.source || e.target === edge.target) {
                    return { ...e, label: content };
                }
                return e;
            });
            GraphService.setEdges(newEdges);
            return newEdges;
        });
    };

    return {
        connectionEdges,
        updConnectionEdges,
        searchTarget,
        searchSource,
        removeConnectionEdge,
        updateLabel,
    };
}
