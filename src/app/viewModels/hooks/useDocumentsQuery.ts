import { useQuery } from "@tanstack/react-query";
import { ProjectService } from "@/app/models/services/ProjectService";
import { Document } from "@/app/models/entity/Document";

export const useDocumentsQuery = (projectId: string | null) => {
    return useQuery<Document[], Error>({
        queryKey: ["documents", projectId],
        queryFn: async () => {
            if (!projectId) return [];
            const documents = await ProjectService.fetchDocumentsByProjectId(
                projectId
            );
            console.debug("Fetched documents:", documents);
            return documents ?? [];
        },
        enabled: !!projectId, // Only run the query if projectId is provided
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};
