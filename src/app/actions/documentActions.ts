"use server";

import { DocumentService } from "@/hocuspocus-server/service/DocumentService";

const documentService = new DocumentService();

export async function loadDocument(documentName: string) {
    try {
        const result = await documentService.onLoadDocument({
            documentName,
            document: new Uint8Array(),
            context: {},
            version: 0,
        });

        return { success: true, data: result };
    } catch (error) {
        console.error("Error loading document:", error);
        return { success: false, error: (error as Error).message };
    }
}

export async function createDocument(
    documentName: string,
    initialContent: Uint8Array
) {
    try {
        // Implement document creation logic here
        // You might need to extend your DocumentService with a create method

        return { success: true, documentName };
    } catch (error) {
        console.error("Error creating document:", error);
        return { success: false, error: (error as Error).message };
    }
}
