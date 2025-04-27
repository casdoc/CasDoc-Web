import { useQuery } from "@tanstack/react-query";
import { ProjectService } from "@/app/models/services/ProjectService";
export const useProjectsQuery = (enabled = true) => {
    return useQuery({
        retry: 1,
        queryKey: ["projects"],
        queryFn: async () => ProjectService.fetchAllProjects(),
        enabled,
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
    });
};
