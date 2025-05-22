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
    static async chat(
        prompt: string,
        projectId: string
    ): Promise<ReadableStream<Uint8Array> | null> {
        try {
            // const token = await this.getAuthToken();
            console.debug(
                "payload:",
                JSON.stringify({
                    prompt,
                    projectId,
                })
            );

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

    static async streamChat(
        prompt: string,
        projectId: string,
        onMessage?: (data: AgentMessage) => void,
        onError?: (error: Error) => void,
        onComplete?: () => void
    ): Promise<void> {
        try {
            const stream = await this.chat(prompt, projectId);

            if (!stream) {
                throw new Error("No stream returned from server");
            }

            const reader = stream.getReader();
            const decoder = new TextDecoder("utf-8");

            while (true) {
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
            }
        } catch (error) {
            console.error("Error in streamChatResponse:", error);
            onError?.(
                error instanceof Error ? error : new Error(String(error))
            );
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
                console.log("Received ping from server");
                return;
            }

            // Parse the JSON data
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

            // Validate with schema
            // const result = AgentMessageSchema.safeParse(data);
            // if (result.success) {
            // Immediately dispatch to UI
            if (onMessage) {
                setTimeout(() => onMessage(data), 0);
            }
            // } else {
            //     console.warn("Invalid message format:", result.error, data);
            // }
        } catch (e) {
            console.debug("Error processing SSE fragment:", e, fragment);
            console.warn("Error processing SSE fragment:", e);
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
