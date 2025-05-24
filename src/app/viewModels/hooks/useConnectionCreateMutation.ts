import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createConnection } from "@/app/models/services/GraphService";
import { ConnectionCreate } from "@/app/models/dto/ConnectionApiRequest";
import { ConnectionEdge } from "@/app/models/entity/ConnectionEdge";

export const useConnectionCreateMutation = (projectId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: ConnectionCreate) => createConnection(input),
        onMutate: async (newConnection: ConnectionCreate) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({
                queryKey: ["connections", projectId],
            });

            // Snapshot the previous value
            const previousConnections = queryClient.getQueryData<
                ConnectionEdge[]
            >(["connections", projectId]);

            // Optimistically update to the new value
            const optimisticConnection = new ConnectionEdge(
                `temp-${Date.now()}`, // temporary ID
                projectId,
                newConnection.sourceId,
                newConnection.targetId,
                newConnection.label || "",
                newConnection.offsetValue || 0,
                newConnection.bidirectional || false
            );

            queryClient.setQueryData<ConnectionEdge[]>(
                ["connections", projectId],
                (old) => {
                    return old
                        ? [...old, optimisticConnection]
                        : [optimisticConnection];
                }
            );

            // Return a context object with the snapshotted value
            return { previousConnections };
        },
        onError: (err, newConnection, context) => {
            // If the mutation fails, use the context returned from onMutate to roll back
            queryClient.setQueryData(
                ["connections", projectId],
                context?.previousConnections
            );
        },
        onSettled: () => {
            // Always refetch after error or success
            queryClient.invalidateQueries({
                queryKey: ["connections", projectId],
            });
        },
    });
};
