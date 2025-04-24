import { Project } from "@/app/models/entity/Project";
import { Document } from "@/app/models/entity/Document";
import { DocumentService } from "./DocumentService";
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

export class ProjectService {
    static async fetchAllProjects(): Promise<Project[] | undefined> {
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
        }
    }

    static async fetchProjectById(id: string): Promise<Project | undefined> {
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

    static async updateProject(
        id: string,
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
            const response = await fetch(
                `${baseUrl}/api/v1/public/projects/${id}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(input),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update project");
            }

            const result: ProjectResponse = await response.json();
            ProjectResponseSchema.parse(result); // Validate the response

            return new Project(
                result.data.id.toString(),
                result.data.name,
                result.data.description ?? ""
            );
        } catch (error) {
            console.error("Error updating project:", error);
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
