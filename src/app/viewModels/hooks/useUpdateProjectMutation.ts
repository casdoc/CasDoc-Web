import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectService } from "@/app/models/services/ProjectService";
import { ProjectApiRequest } from "@/app/models/dto/ProjectApiRequest";
import { Project } from "@/app/models/entity/Project";
import { useRef } from "react";

export const useUpdateProjectMutation = () => {
    const queryClient = useQueryClient();
    const abortControllerRef = useRef<AbortController | null>(null);

    return useMutation({
        mutationFn: async ({
            projectId,
            projectInput,
        }: {
            projectId: string;
            projectInput: ProjectApiRequest;
        }) => {
            // Cancel previous request if exists
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            const controller = new AbortController();
            abortControllerRef.current = controller;

            // Update the project
            const project = await ProjectService.updateProject(
                projectId,
                projectInput
            );

            if (abortControllerRef.current === controller) {
                abortControllerRef.current = null;
            }

            return project;
        },
        // Optimistic update
        onMutate: async ({
            projectId,
            projectInput,
        }: {
            projectId: string;
            projectInput: ProjectApiRequest;
        }) => {
            // Cancel any outgoing refetches to avoid overwriting optimistic update
            await queryClient.cancelQueries({ queryKey: ["projects"] });

            // Snapshot the previous value
            const previousProjects = queryClient.getQueryData<Project[]>([
                "projects",
            ]);

            // Create an optimistic updated project
            if (previousProjects) {
                queryClient.setQueryData(
                    ["projects"],
                    previousProjects.map((project) =>
                        project.id === projectId
                            ? new Project(
                                  project.id,
                                  projectInput.name,
                                  projectInput.description || ""
                              )
                            : project
                    )
                );
            }

            // Return a context object with the snapshotted value
            return { previousProjects };
        },
        // If the mutation fails, use the context returned from onMutate to roll back
        onError: (err, updatedProject, context) => {
            if (context?.previousProjects) {
                queryClient.setQueryData(
                    ["projects"],
                    context.previousProjects
                );
            }

            console.error("Update project error:", err);
        },
        // After success or error, refetch the projects
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
    });
};
