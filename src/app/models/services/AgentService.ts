import supabase from "@/lib/supabase";
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
import { JsonObject } from "../types/JsonObject";

const baseUrl = process.env.NEXT_PUBLIC_AGENT_URL;

// Define message content schema
export const MessageContentSchema = z.object({
    text: z.string().optional(),
    full_text: z.string().optional(),
    tool_name: z.string().optional(),
    args: z.string().optional(),
    result: z.string().optional(),
    message: z.string().optional(),
});

export type MessageContent = z.infer<typeof MessageContentSchema>;

// Define agent message schema
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
    private static async getAuthToken(): Promise<string> {
        const {
            data: { session },
            error,
        } = await supabase.auth.getSession();

        if (error || !session) {
            throw new Error("No valid session found");
        }

        return session.access_token;
    }

    // /api/v1/public/agent/chat
    static async sendMessage(
        prompt: string,
        projectId: string
        // nodeIds?: string[]
    ): Promise<ReadableStream<Uint8Array> | null> {
        try {
            // const token = await this.getAuthToken();
            console.debug(
                "payload:",
                JSON.stringify({
                    prompt,
                    projectId,
                    // nodeIds,
                })
            );
            const response = await fetch(
                `${baseUrl}/api/v1/public/agent/chat`,
                {
                    method: "POST",
                    headers: {
                        // Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        prompt,
                        projectId,
                        // nodeIds,
                    }),
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(
                    `HTTP error! status: ${response.status}, message: ${errorText}`
                );
            }
            console.debug("Response:", response);
            return response.body;
        } catch (error) {
            console.error("Error in sendMessage:", error);
            throw error;
        }
    }

    static async streamChatResponse(
        prompt: string,
        projectId: string,
        // nodeIds?: string[],
        onMessage?: (data: AgentMessage) => void,
        onError?: (error: Error) => void,
        onComplete?: () => void
    ): Promise<void> {
        try {
            const stream = await this.sendMessage(prompt, projectId);

            if (!stream) {
                throw new Error("No stream returned from server");
            }

            const reader = stream.getReader();
            const decoder = new TextDecoder("utf-8");
            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();

                if (done) {
                    // Process any remaining data in buffer
                    if (buffer.trim()) {
                        this.processSSEChunk(buffer, onMessage);
                    }
                    onComplete?.();
                    break;
                }

                // Decode the chunk and add to buffer
                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;

                // Process complete SSE messages from buffer
                const messages = buffer.split(/\n\n/);
                // Keep the last part which might be incomplete
                buffer = messages.pop() || "";

                // Process each complete message
                for (const message of messages) {
                    this.processSSEChunk(message, onMessage);
                }
            }
        } catch (error) {
            console.error("Error in streamChatResponse:", error);
            onError?.(
                error instanceof Error ? error : new Error(String(error))
            );
        }
    }

    private static processSSEChunk(
        chunk: string,
        onMessage?: (data: AgentMessage) => void
    ): void {
        // Process SSE data format: "data: {...}"
        const dataLines = chunk.split(/data:\s*/g).filter((f) => f.trim());

        for (const line of dataLines) {
            try {
                const raw = line.trim();
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let data: any;
                try {
                    data = JSON.parse(raw);
                } catch (e) {
                    console.warn(
                        "JSON.parse failed, trying single‑quote fallback:",
                        e
                    );
                    data = JSON.parse(raw.replace(/'/g, '"'));
                }

                // Validate with schema
                const result = AgentMessageSchema.safeParse(data);
                if (result.success) {
                    // Immediately dispatch to UI
                    if (onMessage) {
                        setTimeout(() => onMessage(result.data), 0);
                    }
                } else {
                    console.warn("Invalid message format:", result.error, data);
                }
            } catch (e) {
                console.debug("Error parsing JSON:", e, line);
                console.warn("Error parsing JSON in SSE chunk:", e, line);
            }
        }
    }

    private static messageConverter(
        message: AgentMessage
    ): AgentResponse | JsonObject | string | null {
        const { type, content } = message;
        const parsedContent = MessageContentSchema.safeParse(content);
        if (!parsedContent.success) {
            console.warn(
                "Invalid message content format:",
                parsedContent.error
            );
            return null;
        }

        if (type === "tool_result") {
            const { tool_name, result } = content;
            if (tool_name === "generate_components") {
                return CreateComponentResponse.parse(result);
            } else if (tool_name === "update_components") {
                return UpdateComponentResponse.parse(result);
            } else if (tool_name === "delete_components") {
                return DeleteComponentResponse.parse(result);
            } else if (tool_name === "connect_components") {
                return ConnectComponentResponse.parse(result);
            } else if (tool_name === "find_components") {
                return FindComponentResponse.parse(result);
            } else if (tool_name === "summarize_components") {
                return SummaryResponse.parse(result);
            } else if (tool_name === "generate_prompt") {
                return PromptGenerationResponse.parse(result);
            } else {
                return null;
            }
        } else if (type === "tool_call") {
            return content.args;
        } else {
            return content.text;
        }
    }
}
