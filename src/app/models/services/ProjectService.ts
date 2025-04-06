import { Project } from "@/app/models/entity/Project";
import { Document } from "@/app/models/entity/Document";
import { DocumentService } from "./DocumentService";
import { ProjectInput } from "@/app/models/types/ProjectInput";
import { v4 as uuidv4 } from "uuid";

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
                        new Date(proj._createdAt),
                        new Date(proj._updatedAt),
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

    static getDocumentsByProjectId(projectId: string): Document[] {
        return DocumentService.getAllDocuments().filter(
            (doc) => doc.projectId === projectId
        );
    }

    static createProject(input: ProjectInput): Project | null {
        if (typeof window === "undefined") return null;
        const projects = this.getAllProjects();
        const newProject = new Project(
            uuidv4(),
            new Date(),
            new Date(),
            input.name,
            input.description
        );

        projects.push(newProject);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
        return newProject;
    }

    static updateProject(projectId: string, update: ProjectInput): void {
        if (typeof window === "undefined") return;
        const projects = this.getAllProjects();
        const index = projects.findIndex((proj) => proj.id === projectId);
        if (index !== -1) {
            const project = projects[index];
            project.name = update.name;
            project.description = update.description;
            project._updatedAt = new Date();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
        }
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
