import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BlockService } from "@/app/models/services/BlockService";
import { UpdateBlockPositionsResponse } from "@/app/models/dto/DocumentApiResponse";
import { useRef } from "react";

export const useUpdateBlockPositionsMutation = () => {
    const queryClient = useQueryClient();
    // Use a Map to store controllers by documentId
    const controllersMapRef = useRef<Map<string, AbortController>>(new Map());

    return useMutation<
        UpdateBlockPositionsResponse | null,
        Error,
        { documentId: string; blockIds: string[] }
    >({
        mutationFn: async ({
            documentId,
            blockIds,
        }: {
            documentId: string;
            blockIds: string[];
        }) => {
            // Cancel previous position update request for this document
            if (controllersMapRef.current.has(documentId)) {
                const previousController =
                    controllersMapRef.current.get(documentId);
                if (previousController) {
                    console.debug(
                        `Aborting previous position update request for document ${documentId}`
                    );
                    previousController.abort();
                }
            }

            // Create a new controller for this request
            const controller = new AbortController();
            controllersMapRef.current.set(documentId, controller);

            try {
                // Update block positions with abort signal
                const result = await BlockService.updateBlockPositions(
                    documentId,
                    blockIds,
                    controller.signal
                );

                // Clean up on success
                controllersMapRef.current.delete(documentId);

                return result;
            } catch (error) {
                // Only clean up if not an abort error
                if (
                    !(
                        error instanceof DOMException &&
                        error.name === "AbortError"
                    )
                ) {
                    controllersMapRef.current.delete(documentId);
                }
                throw error;
            }
        },
        onSuccess: (data, variables) => {
            console.debug("Block positions updated successfully:", data);
            // Optionally invalidate queries if needed, though content query might already cover order changes
            // queryClient.invalidateQueries({ queryKey: ["documentContent", variables.documentId] });
        },
        onError: (err, variables) => {
            // Don't log abort errors as they're expected
            if (!(err instanceof DOMException && err.name === "AbortError")) {
                console.error("Update block positions error:", err, variables);
                // Consider reverting optimistic updates or showing an error message
            } else {
                console.debug(
                    `Position update request for document ${variables.documentId} was aborted`
                );
            }
        },
        onSettled: (data, error, variables) => {
            // Only refetch if not aborted
            if (
                variables?.documentId &&
                !(error instanceof DOMException && error.name === "AbortError")
            ) {
                queryClient.invalidateQueries({
                    queryKey: ["documentContent", variables.documentId],
                });
            }
        },
    });
};
