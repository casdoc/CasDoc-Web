import React, { useState } from "react";
import { marked } from "marked";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import ToolResultComponent from "./ToolResultComponent";

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

interface CollapsibleSectionProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
    className?: string;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
    title,
    children,
    defaultOpen = false,
    className,
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div
            className={cn(
                "my-2 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden",
                className
            )}
        >
            <button
                className="w-full px-4 py-2 text-left bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex justify-between items-center"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="font-medium">{title}</span>
                <ChevronDown
                    className={cn(
                        "h-4 w-4 transition-transform",
                        isOpen ? "transform rotate-180" : ""
                    )}
                />
            </button>
            {isOpen && (
                <div className="overflow-x-auto">
                    <div className="p-4 bg-gray-50 dark:bg-gray-900">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};

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
                    <div className="bg-neutral-700 text-white max-w-xs py-2 px-4 rounded-xl shadow-sm whitespace-pre-wrap ">
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
                        <span className="text-sm">
                            {content.text || "Thinking..."}
                        </span>
                    </div>
                </div>
            );

        case "text_delta":
            return (
                <div className="flex justify-start my-2">
                    <div className="bg-transparent dark:bg-gray-700 text-black dark:text-white px-4 py-2.5 whitespace-pre-wrap">
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
            const formattedArgs = content.args || "";
            return (
                <div className="flex justify-start my-2">
                    <div className="bg-gray-100 dark:bg-gray-700 text-black dark:text-white px-4 py-2.5 rounded-xl shadow-sm whitespace-pre-wrap w-full max-w-md">
                        <CollapsibleSection
                            title={`🔧 Tool: ${content.tool_name}`}
                            defaultOpen={false}
                            className="tool-call"
                        >
                            <pre className="text-sm overflow-x-auto">
                                <code>{formattedArgs}</code>
                            </pre>
                        </CollapsibleSection>
                    </div>
                </div>
            );

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
