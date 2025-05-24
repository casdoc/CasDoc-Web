import { Document } from "@/app/models/entity/Document";
import supabase from "@/lib/supabase";
import { DocumentCreate, DocumentUpdate } from "../dto/DocumentApiRequest";
import {
    DocumentResponse,
    DocumentResponseSchema,
} from "../dto/DocumentApiResponse";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const fetchDocumentById = async (
    id: string
): Promise<Document | undefined> => {
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
            `${baseUrl}/api/v1/public/documents/${id}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch document");
        }

        const result: DocumentResponse = await response.json();
        DocumentResponseSchema.parse(result); // Validate the response

        return new Document(
            result.data.id.toString(),
            result.data.type,
            result.data.projectId.toString(),
            result.data.title,
            result.data.description ?? "",
            [] // content will need to be filled in if your API returns it
        );
    } catch (error) {
        console.error("Error fetching document from API:", error);
        // Fallback to localStorage if API fails
    }
};

export const createDocument = async (
    input: DocumentCreate
): Promise<Document | null> => {
    try {
        const {
            data: { session },
            error,
        } = await supabase.auth.getSession();

        if (error || !session) {
            throw new Error("No valid session found");
        }

        const token = session.access_token;
        const response = await fetch(`${baseUrl}/api/v1/public/documents`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(input),
        });

        if (!response.ok) {
            throw new Error("Failed to create document");
        }

        const result: DocumentResponse = await response.json();
        DocumentResponseSchema.parse(result); // Validate the response

        return Document.fromObject(result.data);
    } catch (error) {
        console.error("Error creating document via API:", error);
        return null;
    }
};

export const updateDocument = async (
    id: string,
    input: DocumentUpdate,
    signal?: AbortSignal
): Promise<Document | null> => {
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
            `${baseUrl}/api/v1/public/documents/${id}`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(input),
                signal,
            }
        );

        if (!response.ok) {
            throw new Error("Failed to update document");
        }

        const result: DocumentResponse = await response.json();
        DocumentResponseSchema.parse(result); // Validate the response

        return Document.fromObject(result.data);
    } catch (error) {
        console.error("Error updating document via API:", error);
        return null;
    }
};

export const deleteDocument = async (
    id: string,
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
            `${baseUrl}/api/v1/public/documents/${id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                signal,
            }
        );

        if (!response.ok) {
            throw new Error("Failed to delete document");
        }
    } catch (error) {
        console.error("Error deleting document via API:", error);
        throw error;
    }
};
