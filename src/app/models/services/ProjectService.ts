import { Project } from "@/app/models/entity/Project";
import { Document } from "@/app/models/entity/Document";
import { DocumentService } from "./DocumentService";
import { ProjectInput } from "@/app/models/types/ProjectInput";
import { createClient } from "@supabase/supabase-js";
import {
    ProjectListResponse,
    ProjectListResponseSchema,
    ProjectResponse,
    ProjectResponseSchema,
} from "@/app/models/dto/ProjectApiResponse";
import { ProjectApiRequest } from "../dto/ProjectApiRequest";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const STORAGE_KEY = "PROJECTS";

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

            const result: ProjectListResponse = await response.json();

            ProjectListResponseSchema.parse(result); // Use parse directly now

            // Map API response to Project entities
            return result.data.map(
                (proj) =>
                    new Project(
                        proj.id.toString(),
                        proj.name,
                        proj.description ?? "" // Handle nullish description
                    )
            );
        } catch (error) {
            console.error("Error fetching projects from API:", error);
            // Fallback to localStorage if API fails
            return this.getProjectsFromLocalStorage();
        }
    }

    static async fetchProjectById(id: string): Promise<Project | null> {
        try {
            const {
                data: { session },
                error,
            } = await supabase.auth.getSession();

            if (error || !session) {
                throw new Error("No valid session found");
            }

            const token = session.access_token;
            const response = await fetch(
                `${baseUrl}/api/v1/public/projects/${id}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch project");
            }

            const result: ProjectResponse = await response.json();
            ProjectResponseSchema.parse(result); // Validate the response

            return new Project(
                result.data.id.toString(),
                result.data.name,
                result.data.description ?? "" // Handle nullish description
            );
        } catch (error) {
            console.error("Error fetching project from API:", error);
            // Fallback to localStorage if API fails
            const projects = this.getProjectsFromLocalStorage();
            return projects.find((proj) => proj.id === id) || null;
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
                    new Project(proj.id, proj._name, proj._description)
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

    static async createProject(
        input: ProjectApiRequest
    ): Promise<Project | undefined> {
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
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(input),
            });

            if (!response.ok) {
                throw new Error("Failed to create project");
            }

            const result: ProjectResponse = await response.json();
            ProjectResponseSchema.parse(result); // Validate the response

            return new Project(
                result.data.id.toString(),
                result.data.name,
                result.data.description ?? ""
            );
        } catch (error) {
            console.error("Error creating project:", error);
        }
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
            localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
        }
    }

    static async deleteProject(
        id: string,
        signal?: AbortSignal
    ): Promise<void> {
        try {
            const {
                data: { session },
                error,
            } = await supabase.auth.getSession();

            if (error || !session) {
                throw new Error("No valid session found");
            }

            const token = session.access_token;
            const response = await fetch(
                `${baseUrl}/api/v1/public/projects/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    signal: signal,
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete project");
            }
        } catch (error) {
            console.error("Error deleting project:", error);
        }
    }
}
