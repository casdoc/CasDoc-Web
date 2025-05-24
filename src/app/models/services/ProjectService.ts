import supabase from "@/lib/supabase";
import { Project } from "@/app/models/entity/Project";
import { ProjectApiRequest } from "../dto/ProjectApiRequest";
import {
    ProjectListResponse,
    ProjectListResponseSchema,
    ProjectResponse,
    ProjectResponseSchema,
} from "@/app/models/dto/ProjectApiResponse";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getAllProjects = async (): Promise<Project[] | undefined> => {
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
        return result.data.map(Project.fromObject);
    } catch (error) {
        console.error("Error fetching projects from API:", error);
        // Fallback to localStorage if API fails
    }
};

export const getProject = async (id: string): Promise<Project | undefined> => {
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

        return Project.fromObject(result.data);
    } catch (error) {
        console.error("Error fetching project from API:", error);
        // Fallback to localStorage if API fails
    }
};

export const createProject = async (
    input: ProjectApiRequest
): Promise<Project | undefined> => {
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

        return Project.fromObject(result.data);
    } catch (error) {
        console.error("Error creating project:", error);
    }
};

export const updateProject = async (
    id: string,
    input: ProjectApiRequest
): Promise<Project | undefined> => {
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

        return Project.fromObject(result.data);
    } catch (error) {
        console.error("Error updating project:", error);
    }
};

export const deleteProject = async (id: string): Promise<void> => {
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
            }
        );

        if (!response.ok) {
            throw new Error("Failed to delete project");
        }
    } catch (error) {
        console.error("Error deleting project:", error);
    }
};
