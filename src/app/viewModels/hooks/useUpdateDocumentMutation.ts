import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DocumentService } from "@/app/models/services/DocumentService";
import { DocumentApiRequest } from "@/app/models/dto/DocumentApiRequest";
import { Document } from "@/app/models/entity/Document";
import { useRef } from "react";

export const useUpdateDocumentMutation = () => {
    const queryClient = useQueryClient();
    const abortControllerRef = useRef<AbortController | null>(null);

    return useMutation({
        mutationFn: async ({
            documentId,
            documentInput,
        }: {
            documentId: string;
            documentInput: DocumentApiRequest;
        }) => {
            // Cancel previous request if exists
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            const controller = new AbortController();
            abortControllerRef.current = controller;

            // Update the document
            const document = await DocumentService.updateDocument(
                documentId,
                documentInput,
                controller.signal
            );

            if (abortControllerRef.current === controller) {
                abortControllerRef.current = null;
            }

            return document;
        },
        // Optimistic update
        onMutate: async ({
            documentId,
            documentInput,
        }: {
            documentId: string;
            documentInput: DocumentApiRequest;
        }) => {
            // Cancel any outgoing refetches to avoid overwriting optimistic update
            await queryClient.cancelQueries({ queryKey: ["documents"] });

            // Snapshot the previous value
            const previousDocuments = queryClient.getQueryData<Document[]>([
                "documents",
            ]);

            // Create an optimistic updated document
            if (previousDocuments) {
                queryClient.setQueryData(
                    ["documents"],
                    previousDocuments.map((document) =>
                        document.id === documentId
                            ? new Document(
                                  document.id,
                                  documentInput.type,
                                  document.projectId,
                                  documentInput.title,
                                  documentInput.description || "",
                                  document.content
                              )
                            : document
                    )
                );
            }

            // Return a context object with the snapshotted value
            return { previousDocuments };
        },
        // If the mutation fails, use the context returned from onMutate to roll back
        onError: (err, updatedDocument, context) => {
            if (context?.previousDocuments) {
                queryClient.setQueryData(
                    ["documents"],
                    context.previousDocuments
                );
            }

            console.error("Update document error:", err);
        },
        // After success or error, refetch the documents
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["documents"] });
        },
    });
};
