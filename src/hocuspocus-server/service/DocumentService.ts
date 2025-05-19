import {
    onConnectPayload,
    onDisconnectPayload,
    onLoadDocumentPayload,
} from "@hocuspocus/server";
import * as Y from "yjs";

// Initial content for new documents
const initialContent = [
    1, 3, 223, 175, 255, 141, 2, 0, 7, 1, 7, 100, 101, 102, 97, 117, 108, 116,
    3, 9, 112, 97, 114, 97, 103, 114, 97, 112, 104, 7, 0, 223, 175, 255, 141, 2,
    0, 6, 4, 0, 223, 175, 255, 141, 2, 1, 17, 72, 101, 108, 108, 111, 32, 87,
    111, 114, 108, 100, 33, 32, 240, 159, 140, 142, 0,
];

export class DocumentService {
    // In-memory document storage (replace with database in production)
    private documents: Map<string, Uint8Array> = new Map();

    async onConnect(data: onConnectPayload) {
        console.log(`Client connected to document: ${data.documentName}`);
    }

    async onDisconnect(data: onDisconnectPayload) {
        console.log(`Client disconnected from document: ${data.documentName}`);
    }

    async onLoadDocument(data: onLoadDocumentPayload) {
        console.log(`Loading document: ${data.documentName}`);

        // Check if we have the document in memory
        if (this.documents.has(data.documentName)) {
            console.log(`Found existing document: ${data.documentName}`);
            return this.documents.get(data.documentName);
        }

        // If the document doesn't exist, create a new one with default content
        console.log(`Creating new document: ${data.documentName}`);

        // Create default document with initial content
        const initialDocContent = Uint8Array.from(initialContent);
        this.documents.set(data.documentName, initialDocContent);

        // Return the initial content
        return initialDocContent;
    }

    // Method to save document updates (can be called from server)
    async saveDocument(documentName: string, content: Uint8Array) {
        this.documents.set(documentName, content);
        console.log(`Document saved: ${documentName}`);
    }
}
