import { Document } from "@/app/models/entity/Document";
import { DocumentUpdate } from "@/app/models/types/DocumentUpdate";

const STORAGE_KEY = "DOCUMENTS";

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
                        new Date(doc.createdAt),
                        new Date(doc.updatedAt),
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

    static getDocumentById(id: string): Document | null {
        if (typeof window === "undefined") return null;
        const documents = this.getAllDocuments();
        return documents.find((doc) => doc.id === id) || null;
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

    static updateDocument(documentId: string, update: DocumentUpdate): void {
        if (typeof window === "undefined") return;
        const documents = this.getAllDocuments();
        const index = documents.findIndex((doc) => doc.id === documentId);
        if (index !== -1) {
            const document = documents[index];
            document.setTitle(update.title);
            document.setDescription(update.description);
            document.setType(update.documentType);
            document.updatedAt = new Date();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
        }
    }

    static deleteDocument(id: string): void {
        if (typeof window === "undefined") return;
        const documents = this.getAllDocuments().filter((doc) => doc.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
    }
}
