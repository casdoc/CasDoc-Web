import { createContext, useContext, ReactNode } from "react";
import {
    useProjectViewModel,
    ProjectViewModel,
} from "@/app/viewModels/ProjectViewModel";

const ProjectContext = createContext<ProjectViewModel | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
    const projectViewModel = useProjectViewModel();

    return (
        <ProjectContext.Provider value={projectViewModel}>
            {children}
        </ProjectContext.Provider>
    );
}

export function useProjectContext(): ProjectViewModel {
    const context = useContext(ProjectContext);
    if (context === undefined) {
        throw new Error(
            "useProjectContext must be used within a ProjectProvider"
        );
    }
    return context;
}
