// import { ConnectionEdge } from "@/app/viewModels/GraphViewModel";
// import defaultEdges from "../default-value/defaultEdges";
import supabase from "@/lib/supabase";
import {
    ConnectionCreate,
    ConnectionUpdate,
} from "../dto/ConnectionApiRequest";
import {
    ConnectionResponse,
    ConnectionResponseSchema,
    ConnectionListResponse,
    ConnectionListResponseSchema,
} from "../dto/ConnectionApiResponse";
import { ConnectionEdge } from "../entity/ConnectionEdge";

// const LOCAL_STORAGE_KEY = "edges";
// const AFFECTED_IDS_KEY = "affectedIds";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getAllConnections = async (
    projectId: string
): Promise<ConnectionEdge[] | undefined> => {
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
            `${baseUrl}/api/v1/public/projects/${projectId}/connections`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch connections");
        }

        const result: ConnectionListResponse = await response.json();
        ConnectionListResponseSchema.parse(result);

        return result.data.map(ConnectionEdge.fromObject);
    } catch (error) {
        console.error("Error fetching connections from API:", error);
    }
};

export const createConnection = async (
    input: ConnectionCreate
): Promise<ConnectionEdge | undefined> => {
    try {
        const {
            data: { session },
            error,
        } = await supabase.auth.getSession();

        if (error || !session) {
            throw new Error("No valid session found");
        }

        const token = session.access_token;
        const response = await fetch(`${baseUrl}/api/v1/public/connections`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(input),
        });

        if (!response.ok) {
            throw new Error("Failed to create connection");
        }

        const result: ConnectionResponse = await response.json();
        ConnectionResponseSchema.parse(result);

        return ConnectionEdge.fromObject(result.data);
    } catch (error) {
        console.error("Error creating connection from API:", error);
    }
};

export const updateConnection = async (
    id: number,
    input: ConnectionUpdate
): Promise<ConnectionEdge | undefined> => {
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
            `${baseUrl}/api/v1/public/connections/${id}`,
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
            throw new Error("Failed to update connection");
        }

        const result: ConnectionResponse = await response.json();
        ConnectionResponseSchema.parse(result);

        return ConnectionEdge.fromObject(result.data);
    } catch (error) {
        console.error("Error updating connection from API:", error);
    }
};

export const deleteConnection = async (
    id: number,
    signal?: AbortSignal
): Promise<void> => {
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
            `${baseUrl}/api/v1/public/connections/${id}`,
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
            throw new Error("Failed to delete connection");
        }
    } catch (error) {
        console.error("Error deleting connection from API:", error);
    }
};

// export const GraphService = () => {
//     getEdges(): ConnectionEdge[] {
//         if (typeof window === "undefined") return [];
//         const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
//         if (!stored) {
//             this.setEdges(defaultEdges);
//         }
//         return stored ? JSON.parse(stored) : [];
//     }
//     setEdges(edges: ConnectionEdge[]): void {
//         if (typeof window !== "undefined") {
//             localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(edges));
//         }
//     }
//     getAffectedIds(): string[] {
//         if (typeof window === "undefined") return [];
//         const stored = localStorage.getItem(AFFECTED_IDS_KEY);
//         return stored ? JSON.parse(stored) : [];
//     }
//     setAffectedIds(ids: string[]): void {
//         if (typeof window !== "undefined") {
//             localStorage.setItem(AFFECTED_IDS_KEY, JSON.stringify(ids));
//         }
//     }
// };
