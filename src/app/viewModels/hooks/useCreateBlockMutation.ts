import {
    useMutation,
    UseMutationOptions,
    useQueryClient,
} from "@tanstack/react-query";
import { BlockService } from "@/app/models/services/BlockService";
import {
    BlockResponse,
    DocumentBlockContent,
} from "@/app/models/dto/DocumentApiResponse";
import { useRef } from "react";

export const useCreateBlockMutation = (
    options?: UseMutationOptions<
        BlockResponse | null,
        Error,
        { documentId: string; content: DocumentBlockContent }
    >
) => {
    const queryClient = useQueryClient();
    // Use a Map to store multiple controllers by temporary ID
    const controllersMapRef = useRef<Map<string, AbortController>>(new Map());

    return useMutation<
        BlockResponse | null,
        Error,
        { documentId: string; content: DocumentBlockContent }
    >({
        mutationFn: async ({
            documentId,
            content,
        }: {
            documentId: string;
            content: DocumentBlockContent;
        }) => {
            // Use content ID as the request identifier
            const requestId = content.attrs?.id || JSON.stringify(content);

            // Cancel previous request for this specific content if exists
            if (controllersMapRef.current.has(requestId)) {
                const previousController =
                    controllersMapRef.current.get(requestId);
                if (previousController) {
                    console.debug(
                        `Aborting previous create request for content ID ${requestId}`
                    );
                    previousController.abort();
                }
            }

            // Create a new controller for this request
            const controller = new AbortController();
            controllersMapRef.current.set(requestId, controller);

            try {
                // Need to update BlockService.createBlock to accept signal parameter
                const result = await BlockService.createBlock(
                    documentId,
                    content,
                    controller.signal
                );
                console.debug("useCreateBlockMutation result:", result);

                // Clean up on success
                controllersMapRef.current.delete(requestId);

                return result;
            } catch (error) {
                // Only clean up if not an abort error
                if (
                    !(
                        error instanceof DOMException &&
                        error.name === "AbortError"
                    )
                ) {
                    controllersMapRef.current.delete(requestId);
                }
                throw error;
            }
        },
        onSuccess: (data, variables, context) => {
            console.debug("Block created successfully:", data);
            // No need to return data here as it doesn't affect the Promise chain

            // Optional: invalidate related queries
            // queryClient.invalidateQueries(['documentBlocks', variables.documentId]);

            // Call the original onSuccess if provided
            if (options?.onSuccess) {
                options.onSuccess(data, variables, context);
            }
        },
        onError: (error, variables, context) => {
            // Don't log abort errors as they're expected
            if (
                !(error instanceof DOMException && error.name === "AbortError")
            ) {
                console.error("Error creating block:", error);
                if (options?.onError) {
                    options.onError(error, variables, context);
                }
            } else {
                console.debug(
                    `Create request for content ID ${
                        variables.content.attrs?.id || "unknown"
                    } was aborted`
                );
            }
        },
    });
};
