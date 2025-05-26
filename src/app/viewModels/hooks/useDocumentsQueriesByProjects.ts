import { Project } from "@/app/models/entity/Project";
import { Document } from "@/app/models/entity/Document";
import { getAllDocuments } from "@/app/models/services/DocumentService";
import { useQueries } from "@tanstack/react-query";

export const useDocumentsQueriesByProjects = (
    projects: Project[] | undefined,
    enabled: boolean = true
) => {
    console.debug(projects);
    const documentQueries = useQueries({
        queries:
            enabled && projects
                ? projects.map((proj) => ({
                      queryKey: ["documents", proj.id],
                      queryFn: async (): Promise<Document[]> =>
                          (await getAllDocuments(proj.id)) ?? [],
                      enabled: true,
                      staleTime: 5 * 60 * 1000,
                  }))
                : [],
    });

    const documentsByProjectId: Record<string, Document[]> = {};
    if (enabled && projects) {
        projects.forEach((proj, idx) => {
            const query = documentQueries[idx];
            if (query?.isSuccess && query.data) {
                documentsByProjectId[proj.id] = query.data;
            }
        });
    }

    return {
        data: documentsByProjectId,
        isSuccess: documentQueries.every((q) => q.isSuccess),
        isLoading: documentQueries.some((q) => q.isLoading),
        isError: documentQueries.some((q) => q.isError),
    };
};
