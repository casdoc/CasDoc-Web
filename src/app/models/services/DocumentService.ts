import { Document } from "@/app/models/entity/Document";
import { DocumentInput } from "@/app/models/types/DocumentInput";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@supabase/supabase-js";
import {
    DocumentResponse,
    DocumentResponseSchema,
} from "@/app/models/dto/DocumentApiResponse";
import { DocumentApiRequest } from "../dto/DocumentApiRequest";
const STORAGE_KEY = "DOCUMENTS";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export class DocumentService {
    static getAllDocuments(): Document[] {
        if (typeof window === "undefined") return [];
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return [];
        try {
            return JSON.parse(data).map(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (doc: any) =>
                    new Document(
                        doc.id,
                        doc._type,
                        doc._projectId,
                        doc._title,
                        doc._description,
                        doc._content
                    )
            );
        } catch (error) {
            console.error("Error parsing documents from localStorage:", error);
            return [];
        }
    }

    static async fetchDocumentById(id: string): Promise<Document | undefined> {
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
    }

    static async createDocument(
        input: DocumentApiRequest
    ): Promise<Document | null> {
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

            const newDocument = new Document(
                result.data.id.toString(),
                result.data.type,
                result.data.projectId.toString(),
                result.data.title,
                result.data.description ?? "",
                []
            );

            return newDocument;
        } catch (error) {
            console.error("Error creating document via API:", error);
            return null;
        }
    }

    static saveDocument(document: Document): void {
        if (typeof window === "undefined") return;
        const documents = this.getAllDocuments();
        const index = documents.findIndex((doc) => doc.id === document.id);
        if (index !== -1) {
            documents[index] = document;
        } else {
            documents.push(document);
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
    }

    static async updateDocument(
        documentId: string,
        documentInput: DocumentApiRequest,
        signal?: AbortSignal
    ): Promise<Document | null> {
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
                `${baseUrl}/api/v1/public/documents/${documentId}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(documentInput),
                    signal,
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update document");
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
            console.error("Error updating document via API:", error);
            return null;
        }
    }

    static async deleteDocument(
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
    }
}
