import React, { useState } from "react";
import { marked } from "marked";
import { ChevronDown, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import ComponentResult from "./ComponentResult";

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

export const renderMarkdown = (text: string): string => {
    if (!text) return "";
    //remove last \n if exists
    if (text.endsWith("\n")) {
        text = text.slice(0, -1);
    }
    // Configure marked
    marked.setOptions({
        breaks: true,
        gfm: true,
        async: false, // Ensure synchronous operation
    });

    // Render markdown (now guaranteed to be synchronous)
    const rendered = marked.parse(text) as string;
    return rendered;
};

/**
 * Parses a string with key=value pairs into a JSON object
 * Handles quoted values, arrays, and Python-style None values
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseKeyValuePairs = (text: string): Record<string, any> => {
    text = text.replace(/'/g, '"');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: Record<string, any> = {};

    // Match regex patterns: key="value" or key=value or key=[array] or key=None
    const regex = /(\w+)=(?:"([^"]*)"|\[(.*?)\]|([^\s]+))/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
        const key = match[1];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let value: any;

        // Check which capture group matched to determine value type
        if (match[2] !== undefined) {
            // Quoted string: key="value"
            value = match[2];
        } else if (match[3] !== undefined) {
            // Array: key=["item1", "item2"]
            try {
                value = JSON.parse(`[${match[3]}]`);
            } catch {
                value = match[3].split(",").map((item) => item.trim());
            }
        } else {
            // Unquoted value: key=value
            const rawValue = match[4];

            if (rawValue === "None") {
                value = null;
            } else if (rawValue === "True" || rawValue === "true") {
                value = true;
            } else if (rawValue === "False" || rawValue === "false") {
                value = false;
            } else if (!isNaN(Number(rawValue))) {
                value = Number(rawValue);
            } else {
                value = rawValue;
            }
        }

        result[key] = value;
    }

    return result;
};

export const MessageComponent: React.FC<{
    message: AgentMessage;
    isUser?: boolean;
}> = ({ message, isUser = false }) => {
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
        case "final_answer":
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

        case "tool_call":
            let formattedArgs = content.args || "";
            // try {
            //     const argObj = JSON.parse(content.args || "{}");
            //     formattedArgs = JSON.stringify(argObj, null, 2);
            // } catch (e) {
            //     throw e;
            //     // Use as is if not valid JSON
            // }

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
            let formattedResult = content.result || "";
            console.debug("tool name:", content.tool_name);
            let resultObj;

            try {
                // First try standard JSON parse
                try {
                    resultObj = parseKeyValuePairs(formattedResult);
                    console.debug("resultObj:", resultObj);
                } catch (jsonError) {
                    // If not valid JSON, try using the AgentService JSON validator
                    throw jsonError;
                }

                if (resultObj) {
                    formattedResult = JSON.stringify(resultObj, null, 2);
                }
            } catch (e) {
                console.warn(
                    "Failed to parse tool result as structured data:",
                    e
                );
                // Use the original format if we can't parse it
            }

            return (
                <div className="flex justify-start my-2">
                    <div className="bg-gray-100 dark:bg-gray-700 text-black dark:text-white px-4 py-2.5 rounded-xl shadow-sm whitespace-pre-wrap w-full max-w-md">
                        <Collapsible className="w-full space-y-2">
                            <div className="flex items-center justify-between space-x-4 px-4">
                                <h4 className="text-sm font-semibold">
                                    {content.tool_name || "Tool Result"}
                                </h4>
                                <CollapsibleTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                        <ChevronsUpDown className="h-4 w-4" />
                                        <span className="sr-only">Toggle</span>
                                    </Button>
                                </CollapsibleTrigger>
                            </div>
                            <CollapsibleContent className="space-y-2">
                                {resultObj ? (
                                    <ComponentResult resultObj={resultObj} />
                                ) : (
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: renderMarkdown(
                                                formattedResult
                                            ),
                                        }}
                                    />
                                )}
                            </CollapsibleContent>
                        </Collapsible>
                    </div>
                </div>
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
