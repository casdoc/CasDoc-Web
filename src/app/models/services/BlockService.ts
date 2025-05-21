import supabase from "@/lib/supabase";
import {
    BlockResponse,
    DocumentBlockContent,
    UpdateBlockPositionsResponse, // Import the new response type
} from "../dto/DocumentApiResponse";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export class BlockService {
    static async createBlock(
        documentId: string,
        content: DocumentBlockContent,
        signal?: AbortSignal
    ): Promise<BlockResponse | null> {
        try {
            const {
                data: { session },
                error,
            } = await supabase.auth.getSession();

            if (error || !session) {
                throw new Error("No valid session found");
            }

            const token = session.access_token;
            const response = await fetch(`${baseUrl}/api/v1/public/blocks`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    documentId,
                    content,
                }),
                signal,
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Failed to create block:", errorData);
                throw new Error(
                    `Failed to create block: ${response.statusText}`
                );
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error("Error creating block via API:", error);
            return null;
        }
    }

    static async updateBlock(
        id: string,
        content: DocumentBlockContent,
        signal?: AbortSignal
    ): Promise<BlockResponse | null> {
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
                `${baseUrl}/api/v1/public/blocks/${id}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        content,
                    }),
                    signal,
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update block");
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error("Error updating block via API:", error);
            return null;
        }
    }

    static async deleteBlock(id: string, signal?: AbortSignal): Promise<void> {
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
                `${baseUrl}/api/v1/public/blocks/${id}`,
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
                throw new Error("Failed to delete block");
            }
        } catch (error) {
            console.error("Error deleting block via API:", error);
            throw error;
        }
    }

    static async updateBlockPositions(
        documentId: string,
        blockIds: string[],
        signal?: AbortSignal
    ): Promise<UpdateBlockPositionsResponse | null> {
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
                `${baseUrl}/api/v1/public/documents/${documentId}/positions`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(blockIds), // Send the array of IDs
                    signal,
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Failed to update block positions:", errorData);
                throw new Error(
                    `Failed to update block positions: ${response.statusText}`
                );
            }

            const result = await response.json();
            // Assuming the schema matches UpdateBlockPositionsResponseSchema
            return result as UpdateBlockPositionsResponse;
        } catch (error) {
            console.error("Error updating block positions via API:", error);
            return null;
        }
    }
}
