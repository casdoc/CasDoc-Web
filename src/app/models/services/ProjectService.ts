import { Project } from "@/app/models/entity/Project";
import { Document } from "@/app/models/entity/Document";
import { DocumentService } from "./DocumentService";
import { ProjectInput } from "@/app/models/types/ProjectInput";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const baseUrl = process.env.BACKEND_URL || "http://localhost:8080";
const STORAGE_KEY = "PROJECTS";

interface ProjectResponseItem {
    id: number;
    createdAt: string;
    updatedAt: string;
    name: string;
    description: string;
}

interface ProjectsResponse {
    status: number;
    message: string;
    timestamp: string;
    data: ProjectResponseItem[];
}

export class ProjectService {
    static async fetchAllProjects(): Promise<Project[]> {
        try {
            const {
                data: { session },
                error,
            } = await supabase.auth.getSession();

            if (error || !session) {
                throw new Error("No valid session found");
            }

            const token = session.access_token;

            const response = await fetch(`${baseUrl}/api/v1/public/projects`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch projects");
            }

            const result: ProjectsResponse = await response.json();
            // Map API response to Project entities
            return result.data.map(
                (proj) =>
                    new Project(
                        proj.id.toString(),
                        new Date(proj.createdAt),
                        new Date(proj.updatedAt),
                        proj.name,
                        proj.description
                    )
            );
        } catch (error) {
            console.error("Error fetching projects from API:", error);
            // Fallback to localStorage if API fails
            return this.getProjectsFromLocalStorage();
        }
    }

    static getProjectsFromLocalStorage(): Project[] {
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

    static getDocumentsByProjectId(projectId: string) {
        return DocumentService.getAllDocuments().filter(
            (doc) => doc.projectId === projectId
        );
    }

    static createProject(input: ProjectInput): Project | null {
        if (typeof window === "undefined") return null;
        // TODO: Implement API call for creating projects
        // For now, using localStorage as fallback
        const projects = this.getProjectsFromLocalStorage();
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

    static updateProject(projectId: string, update: ProjectInput) {
        if (typeof window === "undefined") return;
        // TODO: Implement API call for updating projects
        const projects = this.getProjectsFromLocalStorage();
        const index = projects.findIndex((proj) => proj.id === projectId);
        if (index !== -1) {
            const project = projects[index];
            project.name = update.name;
            project.description = update.description;
            project._updatedAt = new Date();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
        }
    }

    static deleteProject(id: string) {
        if (typeof window === "undefined") return;
        // TODO: Implement API call for deleting projects
        // Delete all documents associated with this project
        const docsToDelete = this.getDocumentsByProjectId(id);
        for (const doc of docsToDelete) {
            DocumentService.deleteDocument(doc.id);
        }

        // Delete the project
        const projects = this.getProjectsFromLocalStorage().filter(
            (proj) => proj.id !== id
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    }
}
