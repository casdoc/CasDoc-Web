import { Project } from "@/app/models/entity/Project";
import { Document } from "@/app/models/entity/Document";
import { DocumentService } from "./DocumentService";

const STORAGE_KEY = "PROJECTS";

export class ProjectService {
    static getAllProjects(): Project[] {
        if (typeof window === "undefined") return [];
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return [];
        try {
            return JSON.parse(data).map(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (proj: any) =>
                    new Project(
                        proj.id,
                        new Date(proj.createdAt),
                        new Date(proj.updatedAt),
                        proj._name,
                        proj._description
                    )
            );
        } catch (error) {
            console.error("Error parsing projects from localStorage:", error);
            return [];
        }
    }

    static getProjectById(id: string): Project | null {
        if (typeof window === "undefined") return null;
        const projects = this.getAllProjects();
        return projects.find((proj) => proj.id === id) || null;
    }

    static saveProject(project: Project): void {
        if (typeof window === "undefined") return;
        const projects = this.getAllProjects();
        const index = projects.findIndex((proj) => proj.id === project.id);
        if (index !== -1) {
            projects[index] = project;
        } else {
            projects.push(project);
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    }

    static getDocumentsByProjectId(projectId: string): Document[] {
        return DocumentService.getAllDocuments().filter(
            (doc) => doc.getProjectId() === projectId
        );
    }

    static deleteProject(id: string): void {
        if (typeof window === "undefined") return;
        // Delete all documents associated with this project
        const docsToDelete = this.getDocumentsByProjectId(id);
        docsToDelete.forEach((doc) => DocumentService.deleteDocument(doc.id));

        // Delete the project
        const projects = this.getAllProjects().filter((proj) => proj.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    }
}
