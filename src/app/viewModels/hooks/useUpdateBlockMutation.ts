import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BlockService } from "@/app/models/services/BlockService";
import { useRef } from "react";

export const useUpdateBlockMutation = () => {
    const queryClient = useQueryClient();
    // Use a Map to store multiple controllers by blockId
    const controllersMapRef = useRef<Map<string, AbortController>>(new Map());

    return useMutation({
        mutationFn: async ({
            blockId,
            content,
            documentId,
        }: {
            blockId: string;
            content: any;
            documentId: string;
        }) => {
            // Cancel previous request for this specific block if exists
            if (controllersMapRef.current.has(blockId)) {
                const previousController =
                    controllersMapRef.current.get(blockId);
                if (previousController) {
                    console.debug(
                        `Aborting previous update request for block ${blockId}`
                    );
                    previousController.abort();
                }
            }

            // Create a new controller for this request
            const controller = new AbortController();
            controllersMapRef.current.set(blockId, controller);

            try {
                // Update the block
                const result = await BlockService.updateBlock(
                    blockId,
                    content,
                    controller.signal
                );

                // Clean up on success
                controllersMapRef.current.delete(blockId);

                return { ...result, documentId };
            } catch (error) {
                // Only clean up if not an abort error
                if (
                    !(
                        error instanceof DOMException &&
                        error.name === "AbortError"
                    )
                ) {
                    controllersMapRef.current.delete(blockId);
                }
                throw error;
            }
        },
        // If the mutation fails
        onError: (err, variables) => {
            // Don't log abort errors as they're expected when canceling requests
            if (!(err instanceof DOMException && err.name === "AbortError")) {
                console.error("Update block error:", err, variables);
            } else {
                console.debug(
                    `Update request for block ${variables.blockId} was aborted`
                );
            }
        },
        // After success or error, refetch the document content
        onSettled: (data, error) => {
            // Only proceed with invalidation if there was no error or it wasn't an abort error
            if (
                data?.documentId &&
                !(error instanceof DOMException && error.name === "AbortError")
            ) {
                queryClient.invalidateQueries({
                    queryKey: ["documentContent", data.documentId],
                });
            }
        },
    });
};
