import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProject } from "@/app/models/services/ProjectService";
import { ProjectApiRequest } from "@/app/models/dto/ProjectApiRequest";
// import { Project } from "@/app/models/entity/Project";
import { useRef } from "react";
// import { v4 as uuidv4 } from "uuid";

export const useCreateProjectMutation = () => {
    const queryClient = useQueryClient();
    const abortControllerRef = useRef<AbortController | null>(null);

    return useMutation({
        mutationFn: async (projectInput: ProjectApiRequest) => {
            // Cancel previous request if exists
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            const controller = new AbortController();
            abortControllerRef.current = controller;

            // Create the project
            const project = createProject(projectInput);

            if (abortControllerRef.current === controller) {
                abortControllerRef.current = null;
            }

            return project;
        },
        // Optimistic update
        // onMutate: async (newProjectInput) => {
        //     // Cancel any outgoing refetches to avoid overwriting optimistic update
        //     await queryClient.cancelQueries({ queryKey: ["projects"] });

        //     // Snapshot the previous value
        //     const previousProjects = queryClient.getQueryData<Project[]>([
        //         "projects",
        //     ]);

        //     // Create an optimistic project (without actually saving it yet)
        //     const optimisticProject = new Project(
        //         uuidv4(),
        //         newProjectInput.name,
        //         newProjectInput.description || ""
        //     );

        //     // Optimistically update the projects list
        //     if (previousProjects) {
        //         queryClient.setQueryData(
        //             ["projects"],
        //             [...previousProjects, optimisticProject]
        //         );
        //     }

        //     // Return a context object with the snapshotted value
        //     return { previousProjects, optimisticProject };
        // },
        // If the mutation fails, use the context returned from onMutate to roll back
        // onError: (err, newProject, context) => {
        //     if (context?.previousProjects) {
        //         queryClient.setQueryData(
        //             ["projects"],
        //             context.previousProjects
        //         );
        //     }

        //     console.error("Create project error:", err);
        // },
        // After success or error, refetch the projects
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
    });
};
