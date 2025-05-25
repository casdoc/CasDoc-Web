import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteConnection } from "@/app/models/services/GraphService";
import { ConnectionEdge } from "@/app/models/entity/ConnectionEdge";

export const useConnectionDeleteMutation = (projectId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteConnection(id),
        onMutate: async (id: number) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({
                queryKey: ["connections", projectId],
            });

            // Snapshot the previous value
            const previousConnections = queryClient.getQueryData<
                ConnectionEdge[]
            >(["connections", projectId]);

            // Optimistically update by removing the connection
            queryClient.setQueryData<ConnectionEdge[]>(
                ["connections", projectId],
                (old) => {
                    if (!old) return old;
                    return old.filter(
                        (connection) => connection.id !== id.toString()
                    );
                }
            );

            // Return a context object with the snapshotted value
            return { previousConnections };
        },
        onError: (err, id, context) => {
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
