import { useQuery } from "@tanstack/react-query";
import { ProjectService } from "@/app/models/services/ProjectService";
import { Document } from "@/app/models/entity/Document";

export const useDocumentsQuery = (projectId: string, enable?: boolean) => {
    return useQuery<Document[], Error>({
        queryKey: ["documents", projectId],
        queryFn: async () => {
            if (!projectId) return [];
            const documents = await ProjectService.fetchDocumentsByProjectId(
                projectId
            );
            console.debug("useDocumentsQuery", projectId, documents);
            return documents ?? [];
        },
        enabled: !!projectId && enable,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};
