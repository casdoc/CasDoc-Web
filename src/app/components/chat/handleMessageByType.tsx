import { marked } from "marked";
import ToolResultComponent from "./ToolResultComponent";
import { LoadingToolCallComponent } from "./LoadingToolCallComponent";

export interface MessageContent {
    text?: string;
    full_text?: string;
    tool_name?: string;
    args?: string;
    result?: string;
    message?: string;
}

export interface AgentMessage {
    type: string;
    content: MessageContent;
    conversationId?: string; // to track which conversation a message belongs to
    messageSegmentId?: string; // to track different text segments within a conversation
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const renderMarkdown = (text: any): string => {
    // First ensure text is a string
    if (text === null || text === undefined) return "";

    // Convert to string if it's not already
    const textStr = typeof text === "string" ? text : String(text);

    // Remove last \n if exists
    let processedText = textStr;
    if (textStr.endsWith("\n")) {
        processedText = textStr.slice(0, -1);
    }

    // Configure marked
    marked.setOptions({
        breaks: true,
        gfm: true,
        async: false, // Ensure synchronous operation
    });

    // Render markdown (now guaranteed to be synchronous)
    const rendered = marked.parse(processedText) as string;
    return rendered;
};

export const MessageComponent: React.FC<{
    message: AgentMessage;
    isUser?: boolean;
}> = ({ message }) => {
    const { type, content } = message;

    switch (type) {
        case "user_prompt":
            return (
                <div className="flex justify-end">
                    <div className="bg-neutral-700 text-white max-w-xl py-2 px-4 rounded-xl shadow-sm whitespace-pre-wrap ">
                        <span
                            className="flex"
                            dangerouslySetInnerHTML={{
                                __html: renderMarkdown(content.text || ""),
                            }}
                        />
                    </div>
                </div>
            );

        case "thinking":
            return (
                <div className="flex justify-start my-2">
                    <div className="text-black dark:text-white max-w-xs px-3 py-2 rounded-xl flex items-center">
                        <div className="w-5 h-5 border-2 border-blue-400 dark:border-blue-500 border-t-transparent border-b-transparent rounded-full animate-spin mr-2"></div>
                        <span className="text-sm">{"Thinking..."}</span>
                    </div>
                </div>
            );

        case "text_delta":
            return (
                <div className="flex justify-start my-2">
                    <div className="bg-transparent dark:bg-gray-700 text-black dark:text-white py-2.5 whitespace-pre-wrap">
                        <span
                            className="flex flex-col"
                            dangerouslySetInnerHTML={{
                                __html: renderMarkdown(
                                    content.full_text || content.text || ""
                                ),
                            }}
                        />
                    </div>
                </div>
            );

        case "final_answer":
            return (
                <div className="flex justify-start my-2">
                    <div className="bg-green-100 dark:bg-green-900/30 text-black dark:text-white px-4 py-2.5 rounded-xl shadow-sm whitespace-pre-wrap">
                        <p className="font-bold">Final Answer:</p>
                        <span
                            className="flex flex-col"
                            dangerouslySetInnerHTML={{
                                __html: renderMarkdown(content.text || ""),
                            }}
                        />
                    </div>
                </div>
            );

        case "tool_call":
        case "tool_call_delta":
            return <LoadingToolCallComponent />;

        case "tool_result":
            return (
                <ToolResultComponent
                    toolName={content.tool_name}
                    contentResult={content.result}
                />
            );

        case "error":
            return (
                <div className="flex justify-start my-2">
                    <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-4 py-2.5 rounded-xl shadow-sm whitespace-pre-wrap">
                        <p className="font-bold">Error:</p>
                        <p>{content.message}</p>
                    </div>
                </div>
            );

        default:
            return null;
    }
};
