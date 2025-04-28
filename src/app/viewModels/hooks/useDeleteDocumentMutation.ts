import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DocumentService } from "@/app/models/services/DocumentService";
import { Document } from "@/app/models/entity/Document";
import { useRef } from "react";
import { useProjectContext } from "../context/ProjectContext";

export const useDeleteDocumentMutation = () => {
    const queryClient = useQueryClient();
    const abortControllerRef = useRef<AbortController | null>(null);
    const { selectDocument } = useProjectContext();

    return useMutation({
        mutationFn: async (documentId: string) => {
            // Cancel previous request if exists
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            const controller = new AbortController();
            abortControllerRef.current = controller;

            // Get the project ID before deleting the document
            const document = await DocumentService.fetchDocumentById(
                documentId
            );
            const projectId = document?.projectId;

            // Delete the document
            await DocumentService.deleteDocument(documentId, controller.signal);

            if (abortControllerRef.current === controller) {
                abortControllerRef.current = null;
            }

            return { documentId, projectId };
        },
        // Optimistic update
        onMutate: async (documentId) => {
            // Get the document to find its project ID
            const documents = queryClient.getQueriesData<Document[]>({
                queryKey: ["documents"],
            });
            let projectId: string | undefined;
            let targetDocuments: Document[] | undefined;

            // Find the project ID and documents array for this document
            for (const [queryKey, docs] of documents) {
                if (
                    !Array.isArray(queryKey) ||
                    queryKey.length !== 2 ||
                    queryKey[0] !== "documents"
                )
                    continue;

                const docInProject = docs?.find((doc) => doc.id === documentId);
                if (docInProject) {
                    projectId = docInProject.projectId;
                    targetDocuments = docs;
                    break;
                }
            }

            if (!projectId || !targetDocuments) {
                console.warn(
                    "Could not find document or project ID for optimistic update"
                );
                return { previousDocuments: undefined, documentId };
            }

            // Cancel any outgoing refetches to avoid overwriting optimistic update
            await queryClient.cancelQueries({
                queryKey: ["documents", projectId],
            });

            // Snapshot the previous value
            const previousDocuments = queryClient.getQueryData<Document[]>([
                "documents",
                projectId,
            ]);

            // Optimistically remove the document from the list
            if (previousDocuments) {
                queryClient.setQueryData(
                    ["documents", projectId],
                    previousDocuments.filter(
                        (document) => document.id !== documentId
                    )
                );
            }

            // Return a context object with the snapshotted value
            return { previousDocuments, documentId, projectId };
        },
        // If the mutation fails, use the context returned from onMutate to roll back
        onError: (err, documentId, context) => {
            if (context?.previousDocuments && context.projectId) {
                queryClient.setQueryData(
                    ["documents", context.projectId],
                    context.previousDocuments
                );
            }

            console.error("Delete document error:", err);
        },
        // After success or error, refetch the documents
        onSettled: (data) => {
            if (data?.projectId) {
                queryClient.invalidateQueries({
                    queryKey: ["documents", data.projectId],
                });
            }
            selectDocument("");
        },
    });
};
