import { createClient } from "@supabase/supabase-js";
import { any, z } from "zod";
import { ProjectData } from "@/app/viewModels/ChatViewModel";
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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);
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
        projectData?: ProjectData
    ): Promise<ReadableStream<Uint8Array> | null> {
        try {
            // const token = await this.getAuthToken();

            // Properly serialize the projectData for the backend
            const serializedProjectData = projectData
                ? JSON.stringify(projectData)
                : null;

            console.debug(
                "payload:",
                JSON.stringify({
                    prompt,
                    project_data: serializedProjectData,
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
                        project_data: serializedProjectData,
                    }),
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(
                    `HTTP error! status: ${response.status}, message: ${errorText}`
                );
            }
            // console.debug("Response:", response);
            return response.body;
        } catch (error) {
            console.error("Error in sendMessage:", error);
            throw error;
        }
    }

    // /api/v1/public/agent/connect
    static async connectionAdvice(
        prompt: string,
        projectData?: ProjectData,
        componentId?: string
    ): Promise<ReadableStream<Uint8Array> | null> {
        try {
            const serializedProjectData = projectData
                ? JSON.stringify(projectData)
                : null;

            console.debug(
                "payload:",
                JSON.stringify({
                    prompt,
                    project_data: serializedProjectData,
                    component_id: componentId,
                })
            );

            const response = await fetch(
                `${baseUrl}/api/v1/public/agent/connect`,
                {
                    method: "POST",
                    headers: {
                        // Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        prompt,
                        project_data: serializedProjectData,
                        component_id: componentId,
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
            console.error("Error in connectionAdvice:", error);
            throw error;
        }
    }

    // /api/v1/public/agent/edit/component
    static async editComponent(
        prompt: string,
        projectData?: ProjectData,
        componentId?: string
    ): Promise<ReadableStream<Uint8Array> | null> {
        try {
            const serializedProjectData = projectData
                ? JSON.stringify(projectData)
                : null;

            console.debug(
                "payload:",
                JSON.stringify({
                    prompt,
                    project_data: serializedProjectData,
                    component_id: componentId,
                })
            );

            const response = await fetch(
                `${baseUrl}/api/v1/public/agent/edit/component`,
                {
                    method: "POST",
                    headers: {
                        // Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        prompt,
                        project_data: serializedProjectData,
                        component_id: componentId,
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
            console.error("Error in editComponent:", error);
            throw error;
        }
    }

    // /api/v1/public/agent/new/project
    static async createProject(
        prompt: string
    ): Promise<ReadableStream<Uint8Array> | null> {
        try {
            console.debug(
                "payload:",
                JSON.stringify({
                    prompt,
                })
            );

            const response = await fetch(
                `${baseUrl}/api/v1/public/agent/new/project`,
                {
                    method: "POST",
                    headers: {
                        // Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        prompt,
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
            console.error("Error in newProject:", error);
            throw error;
        }
    }

    // /api/v1/public/agent/diff/advice
    static async diffAdvice(
        prompt: string,
        projectData: ProjectData,
        componentId: string,
        sourceId: string,
        sourceNewContent: string
    ): Promise<ReadableStream<Uint8Array> | null> {
        try {
            const serializedProjectData = projectData
                ? JSON.stringify(projectData)
                : null;

            console.debug(
                "payload:",
                JSON.stringify({
                    prompt,
                    project_data: serializedProjectData,
                    component_id: componentId,
                    source_id: sourceId,
                    source_new_content: sourceNewContent,
                })
            );

            const response = await fetch(
                `${baseUrl}/api/v1/public/agent/diff/advice`,
                {
                    method: "POST",
                    headers: {
                        // Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        prompt,
                        project_data: serializedProjectData,
                        component_id: componentId,
                        source_id: sourceId,
                        source_new_content: sourceNewContent,
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
            console.error("Error in diffAdvice:", error);
            throw error;
        }
    }

    static async streamChatResponse(
        prompt: string,
        projectData?: ProjectData | null,
        // nodeIds?: string[],
        onMessage?: (data: AgentMessage) => void,
        onError?: (error: Error) => void,
        onComplete?: () => void
    ): Promise<void> {
        if (!projectData) return;
        try {
            const stream = await this.sendMessage(prompt, projectData);

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

                // Process any complete events immediately
                // Look for data: lines in the buffer
                const lines = buffer.split("\n");
                let newBuffer = "";
                let currentEvent = "";

                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];

                    // If this is a data line, add it to the current event
                    if (line.startsWith("data:")) {
                        currentEvent += line + "\n";

                        // If the next line is empty or the last line, this event is complete
                        if (
                            i + 1 >= lines.length ||
                            lines[i + 1].trim() === ""
                        ) {
                            // Process this complete event immediately
                            this.processSSEChunk(currentEvent, onMessage);
                            currentEvent = "";
                            i++; // Skip the empty line
                        }
                    } else if (currentEvent) {
                        // If we have a current event but this isn't a data line
                        // and it's not an empty line, something is wrong with the format
                        if (line.trim() !== "") {
                            // Add to current event and continue
                            currentEvent += line + "\n";
                        } else {
                            // Empty line means end of event
                            this.processSSEChunk(currentEvent, onMessage);
                            currentEvent = "";
                        }
                    } else if (line.trim() !== "") {
                        // If no current event and not an empty line,
                        // save to buffer for next iteration
                        newBuffer += line + "\n";
                    }
                }

                // Save any unprocessed lines and current partial event for next iteration
                buffer = newBuffer + currentEvent;
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
                        onMessage(result.data); // Remove setTimeout for immediate update
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
