import { useQuery } from "@tanstack/react-query";
import { getAllDocuments } from "@/app/models/services/DocumentService";
import { Document } from "@/app/models/entity/Document";

export const useDocumentsQuery = (projectId: string, enable?: boolean) => {
    return useQuery<Document[], Error>({
        queryKey: ["documents", projectId],
        queryFn: async () => {
            if (!projectId) return [];
            const documents = await getAllDocuments(projectId);

            return documents ?? [];
        },
        enabled: !!projectId && enable,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};
