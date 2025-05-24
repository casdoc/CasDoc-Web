import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateConnection } from "@/app/models/services/GraphService";
import { ConnectionUpdate } from "@/app/models/dto/ConnectionApiRequest";
import { ConnectionEdge } from "@/app/models/entity/ConnectionEdge";

export const useConnectionUpdateMutation = (projectId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, input }: { id: number; input: ConnectionUpdate }) =>
            updateConnection(id, input),
        onMutate: async ({
            id,
            input,
        }: {
            id: number;
            input: ConnectionUpdate;
        }) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({
                queryKey: ["connections", projectId],
            });

            // Snapshot the previous value
            const previousConnections = queryClient.getQueryData<
                ConnectionEdge[]
            >(["connections", projectId]);

            // Optimistically update to the new value
            queryClient.setQueryData<ConnectionEdge[]>(
                ["connections", projectId],
                (old) => {
                    if (!old) return old;
                    return old.map((connection) => {
                        if (connection.id === id.toString()) {
                            // Update the connection with new values
                            connection.label = input.label;
                            connection.offsetValue = input.offsetValue;
                            return connection;
                        }
                        return connection;
                    });
                }
            );

            // Return a context object with the snapshotted value
            return { previousConnections };
        },
        onError: (err, variables, context) => {
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
