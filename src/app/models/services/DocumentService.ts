import { Document } from "@/app/models/entity/Document";
import { DocumentInput } from "@/app/models/types/DocumentInput";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@supabase/supabase-js";
import {
    DocumentResponse,
    DocumentResponseSchema,
} from "@/app/models/dto/DocumentApiResponse";
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

    // Keep the existing getDocumentById as a fallback for now
    static getDocumentById(id: string): Document | null {
        if (typeof window === "undefined") return null;
        const documents = this.getAllDocuments();
        return documents.find((doc) => doc.id === id) || null;
    }

    static createDocument(input: DocumentInput): Document | null {
        if (typeof window === "undefined") return null;
        const documents = this.getAllDocuments();
        const newDocument = new Document(
            uuidv4(),

            input.type,
            input.projectId,
            input.title,
            input.description,
            input.content ?? []
        );

        documents.push(newDocument);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
        return newDocument;
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

    static updateDocument(documentId: string, update: DocumentInput): void {
        if (typeof window === "undefined") return;
        const documents = this.getAllDocuments();
        const index = documents.findIndex((doc) => doc.id === documentId);
        if (index !== -1) {
            const document = documents[index];
            document.title = update.title;
            document.description = update.description;
            document.type = update.type;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
        }
    }

    static deleteDocument(id: string): void {
        if (typeof window === "undefined") return;
        const documents = this.getAllDocuments().filter((doc) => doc.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
    }
}
