import { any, z } from "zod";
import { AdviceComponentResponse } from "../agent-response/AdviceComponentResponse";
import { AgentEditComponentResponse } from "../agent-response/AgentEditComponentResponse";
import { ConnectComponentResponse } from "../agent-response/ConnectComponentResponse";
import { CreateComponentResponse } from "../agent-response/CreateComponentResponse";
import { DeleteComponentResponse } from "../agent-response/DeleteComponentResponse";
import { FindComponentResponse } from "../agent-response/FindComponentResponse";
import { IdeaDocumentResponse } from "../agent-response/IdeaDocumentResponse";
import { PromptGenerationResponse } from "../agent-response/PromptGenerationResponse";
import { SummaryResponse } from "../agent-response/SummaryResponse";
import { UpdateComponentResponse } from "../agent-response/UpdateComponentResponse";

const baseUrl = process.env.NEXT_PUBLIC_AGENT_URL;

export const MessageContentSchema = z.object({
    text: z.string().optional(),
    full_text: z.string().optional(),
    tool_name: z.string().optional(),
    args: z.string().optional(),
    result: z.string().optional(),
    message: z.string().optional(),
});

export type MessageContent = z.infer<typeof MessageContentSchema>;

export const AgentMessageSchema = z.object({
    type: z.string(),
    content: any(),
});

export type AgentMessage = z.infer<typeof AgentMessageSchema>;

export type AgentResponse =
    | AdviceComponentResponse
    | AgentEditComponentResponse
    | ConnectComponentResponse
    | CreateComponentResponse
    | DeleteComponentResponse
    | FindComponentResponse
    | IdeaDocumentResponse
    | PromptGenerationResponse
    | SummaryResponse
    | UpdateComponentResponse;

export class AgentService {
    static async chat(
        prompt: string,
        projectId: string,
        signal?: AbortSignal
    ): Promise<ReadableStream<Uint8Array> | null> {
        try {
            const response = await fetch(
                `${baseUrl}/api/v1/public/agent/chat`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        prompt,
                        projectId,
                    }),
                    signal: signal,
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(
                    `HTTP error! status: ${response.status}, message: ${errorText}`
                );
            }
            return response.body;
        } catch (error) {
            console.error("Error in sendMessage:", error);
            throw error;
        }
    }

    static async connect(
        componentId: string,
        projectId: string
    ): Promise<ReadableStream<Uint8Array> | null> {
        try {
            const response = await fetch(
                `${baseUrl}/api/v1/public/agent/connect`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        componentId,
                        projectId,
                    }),
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(
                    `HTTP error! status: ${response.status}, message: ${errorText}`
                );
            }
            return response.body;
        } catch (error) {
            console.error("Error in sendMessage:", error);
            throw error;
        }
    }

    static async handleStreamResponse(
        response: ReadableStream<Uint8Array>,
        signal?: AbortSignal,
        onMessage?: (data: AgentMessage) => void,
        onError?: (error: Error) => void,
        onComplete?: () => void
    ): Promise<void> {
        let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;

        try {
            reader = response.getReader();
            const decoder = new TextDecoder("utf-8");

            while (true) {
                // Check if abort was requested before each read operation
                if (signal?.aborted) {
                    throw new DOMException("Aborted", "AbortError");
                }

                try {
                    const { done, value } = await reader.read();

                    if (done) {
                        onComplete?.();
                        break;
                    }

                    // Decode the chunk
                    const rawChunk = decoder.decode(value, { stream: true });

                    // Split rawChunk by SSE 'data:' delimiter to get JSON fragments
                    const fragments = rawChunk
                        .split(/data:\s*/g)
                        .filter((f) => f.trim());

                    for (const fragment of fragments) {
                        this.processSSEFragment(fragment, onMessage);
                    }
                } catch (readError) {
                    // Check if this is an abort error
                    if (signal?.aborted || readError === "AbortError") {
                        throw new DOMException("Aborted", "AbortError");
                    }
                    throw readError;
                }
            }
        } catch (error) {
            // Close reader if we have it and an error occurred
            if (reader) {
                try {
                    await reader.cancel("Stream processing terminated");
                } catch (cancelError) {
                    console.warn(
                        "Error cancelling stream reader:",
                        cancelError
                    );
                }
            }

            // Only call onError for non-abort errors
            if (error !== "AbortError" && onError) {
                onError(
                    error instanceof Error ? error : new Error(String(error))
                );
            }

            // Only rethrow non-abort errors
            if (error !== "AbortError") {
                throw error;
            }
        } finally {
            // Ensure resources are cleaned up
            if (reader && signal?.aborted) {
                try {
                    await reader.cancel("Aborted by user");
                } catch (finalError) {
                    console.warn("Error in final cleanup:", finalError);
                }
            }
        }
    }

    private static processSSEFragment(
        fragment: string,
        onMessage?: (data: AgentMessage) => void
    ): void {
        try {
            const trimmedFragment = fragment.trim();
            // Handle ping messages
            if (trimmedFragment.includes("ping")) {
                return;
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let data: any;
            try {
                data = JSON.parse(trimmedFragment);
            } catch (e) {
                console.warn(
                    "JSON.parse failed, trying single‑quote fallback:",
                    e
                );
                data = JSON.parse(trimmedFragment.replace(/'/g, '"'));
            }

            if (onMessage) {
                setTimeout(() => onMessage(data), 0);
            }
        } catch (e) {
            console.warn("Error processing SSE fragment:", e);
        }
    }
}
