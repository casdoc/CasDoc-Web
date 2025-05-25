import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProject } from "@/app/models/services/ProjectService";
import { Project } from "@/app/models/entity/Project";
import { useRef } from "react";
import { useProjectContext } from "../context/ProjectContext";

export const useDeleteProjectMutation = () => {
    const queryClient = useQueryClient();
    const abortControllerRef = useRef<AbortController | null>(null);
    const { selectProject } = useProjectContext();

    return useMutation({
        mutationFn: async (projectId: string) => {
            // Cancel previous request if exists
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            const controller = new AbortController();
            abortControllerRef.current = controller;

            // Delete the project
            await deleteProject(projectId);

            if (abortControllerRef.current === controller) {
                abortControllerRef.current = null;
            }

            return projectId;
        },
        // Optimistic update
        onMutate: async (projectId) => {
            // Cancel any outgoing refetches to avoid overwriting optimistic update
            await queryClient.cancelQueries({ queryKey: ["projects"] });

            // Snapshot the previous value
            const previousProjects = queryClient.getQueryData<Project[]>([
                "projects",
            ]);

            // Optimistically remove the project from the list
            if (previousProjects) {
                queryClient.setQueryData(
                    ["projects"],
                    previousProjects.filter(
                        (project) => project.id !== projectId
                    )
                );
            }

            // Return a context object with the snapshotted value
            return { previousProjects, projectId };
        },
        // If the mutation fails, use the context returned from onMutate to roll back
        onError: (err, projectId, context) => {
            if (context?.previousProjects) {
                queryClient.setQueryData(
                    ["projects"],
                    context.previousProjects
                );
            }

            console.error("Delete project error:", err);
        },
        // After success or error, refetch the projects
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });

            selectProject("");
        },
    });
};
