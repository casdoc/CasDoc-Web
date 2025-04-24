import { useQuery } from "@tanstack/react-query";
import { DocumentService } from "@/app/models/services/DocumentService";
import { Document } from "@/app/models/entity/Document";

export const useDocumentQuery = (
    documentId: string | null,
    enable: boolean = true
) => {
    return useQuery<Document | undefined, Error>({
        queryKey: ["document", documentId],
        queryFn: async () => {
            if (!documentId) return undefined;
            const document = await DocumentService.fetchDocumentById(
                documentId
            );
            return document;
        },
        enabled: !!documentId && enable,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};
