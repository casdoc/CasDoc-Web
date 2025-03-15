import { useState, useCallback, useEffect } from "react";
import { GraphService } from "../models/services/GraphService";

export interface GraphViewModel {
    fetchConnectionEdges: () => void;
    updConnectionEdges: (edge: ConnectionEdge) => void;
    searchBySourceId: (sourceId: string) => ConnectionEdge[];
    removeConnectionEdge: (edge: ConnectionEdge) => void;
}

export interface ConnectionEdge {
    source: string;
    target: string;
}

export function useGraphViewModel(): GraphViewModel {
    const [connectionEdges, setConnectionEdges] = useState<ConnectionEdge[]>(
        []
    );

    const fetchConnectionEdges = useCallback(() => {
        const localEdges = GraphService.getEdges();
        setConnectionEdges(localEdges);
        return localEdges;
    }, []);

    useEffect(() => {
        fetchConnectionEdges();
    }, [fetchConnectionEdges]);

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

    const searchBySourceId = (sourceId: string): ConnectionEdge[] => {
        return connectionEdges.filter(
            (edge) => edge.source === sourceId.toString()
        );
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

    return {
        fetchConnectionEdges,
        updConnectionEdges,
        searchBySourceId,
        removeConnectionEdge,
    };
}
