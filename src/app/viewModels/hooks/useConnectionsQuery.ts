import { useQuery } from "@tanstack/react-query";
import { getAllConnections } from "@/app/models/services/GraphService";
import { ConnectionEdge } from "@/app/models/entity/ConnectionEdge";

export const useConnectionsQuery = (projectId: string, enable?: boolean) => {
    return useQuery<ConnectionEdge[], Error>({
        queryKey: ["connections", projectId],
        queryFn: async () => {
            if (!projectId) return [];
            const connections = await getAllConnections(projectId);

            return connections ?? [];
        },
        enabled: !!projectId && enable,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};
