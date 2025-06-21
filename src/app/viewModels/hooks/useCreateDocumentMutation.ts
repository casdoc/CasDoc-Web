import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDocument } from "@/app/models/services/DocumentService";
// import { Document } from "@/app/models/entity/Document";
import { useRef } from "react";
// import { v4 as uuidv4 } from "uuid";
import { DocumentCreate } from "@/app/models/dto/DocumentApiRequest";
import { useRouter } from "next/navigation";

export const useCreateDocumentMutation = (options?: {
    autoNavigate?: boolean;
}) => {
    const queryClient = useQueryClient();
    const abortControllerRef = useRef<AbortController | null>(null);

    const router = useRouter();
    const shouldAutoNavigate = options?.autoNavigate ?? true;

    return useMutation({
        mutationFn: async (documentInput: DocumentCreate) => {
            // Cancel previous request if exists
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            const controller = new AbortController();
            abortControllerRef.current = controller;

            // Create the document
            const document = await createDocument(documentInput);

            if (abortControllerRef.current === controller) {
                abortControllerRef.current = null;
            }

            if (!document) {
                throw new Error("Failed to create document");
            }

            return document;
        },
        // Optimistic update
        // onMutate: async (newDocumentInput) => {
        //     // Cancel any outgoing refetches to avoid overwriting optimistic update
        //     await queryClient.cancelQueries({
        //         queryKey: ["documents", newDocumentInput.projectId],
        //     });

        //     // Snapshot the previous value
        //     const previousDocuments = queryClient.getQueryData<Document[]>([
        //         "documents",
        //         newDocumentInput.projectId,
        //     ]);

        //     // Create an optimistic document (without actually saving it yet)
        //     const optimisticDocument = new Document(
        //         uuidv4(),
        //         newDocumentInput.type,
        //         newDocumentInput.projectId.toString(),
        //         newDocumentInput.title,
        //         newDocumentInput.description,
        //         []
        //     );

        //     // Optimistically update the documents list
        //     if (previousDocuments) {
        //         queryClient.setQueryData(
        //             ["documents", newDocumentInput.projectId],
        //             [...previousDocuments, optimisticDocument]
        //         );
        //     }

        //     // Return a context object with the snapshotted value
        //     return { previousDocuments, optimisticDocument };
        // },
        // If the mutation success, select new document (only if autoNavigate is true)
        onSuccess: (document) => {
            if (shouldAutoNavigate) {
                router.push(`/documents/${document.id}`);
            }
        },
        // If the mutation fails, use the context returned from onMutate to roll back
        // onError: (err, newDocumentInput, context) => {
        //     if (context?.previousDocuments) {
        //         queryClient.setQueryData(
        //             ["documents", newDocumentInput.projectId],
        //             context.previousDocuments
        //         );
        //     }

        //     console.error("Create document error:", err);
        // },
        // After success or error, refetch the documents
        onSettled: (data) => {
            if (data) {
                queryClient.invalidateQueries({
                    queryKey: ["documents", data.projectId],
                });
            }
        },
    });
};
