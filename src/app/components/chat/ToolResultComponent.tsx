import { Button } from "@/components/ui/button";
import TransferComponentUI from "./TransferComponentUI";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown, Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

interface ComponentResultProps {
    toolName?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    contentResult?: any;
}

export const ToolResultComponent = ({
    toolName,
    contentResult,
}: ComponentResultProps) => {
    if (!contentResult || !toolName) {
        return null;
    }

    switch (toolName) {
        case "generate_components":
            return (
                <div>
                    <div>{contentResult?.reason}</div>
                    {contentResult?.createdComponents?.map(
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (component: any, idx: number) => (
                            <div
                                className="flex justify-start py-1 px-1"
                                key={idx}
                            >
                                <div className="bg-gray-100 dark:bg-gray-700 text-black dark:text-white rounded-xl shadow-sm whitespace-pre-wrap w-full max-w-md">
                                    <Collapsible
                                        className="w-full space-y-2 my-1"
                                        defaultOpen={true}
                                    >
                                        <div className="flex items-center justify-between space-x-4 px-4">
                                            <h4 className="text-sm font-semibold">
                                                {"Generated Component"}
                                            </h4>
                                            <CollapsibleTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                >
                                                    <ChevronsUpDown className="h-4 w-4" />
                                                </Button>
                                            </CollapsibleTrigger>
                                        </div>
                                        <CollapsibleContent className="space-y-2">
                                            <TransferComponentUI
                                                key={idx}
                                                content={component}
                                            />
                                        </CollapsibleContent>
                                    </Collapsible>
                                </div>
                            </div>
                        )
                    )}
                </div>
            );
        case "update_components":
            return (
                <div>
                    <div>{contentResult?.reason}</div>
                    {contentResult?.updatedComponent?.map(
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (component: any, idx: number) => (
                            <div
                                className="flex justify-start py-1 px-1"
                                key={idx}
                            >
                                <div className="bg-gray-100 dark:bg-gray-700 text-black dark:text-white rounded-xl shadow-sm whitespace-pre-wrap w-full max-w-md">
                                    <Collapsible
                                        className="w-full space-y-2 my-1"
                                        defaultOpen={true}
                                    >
                                        <div className="flex items-center justify-between space-x-4 px-4">
                                            <h4 className="text-sm font-semibold">
                                                {"Updated Component"}
                                            </h4>
                                            <CollapsibleTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                >
                                                    <ChevronsUpDown className="h-4 w-4" />
                                                </Button>
                                            </CollapsibleTrigger>
                                        </div>
                                        <CollapsibleContent className="space-y-2">
                                            <TransferComponentUI
                                                key={idx}
                                                content={component}
                                            />
                                        </CollapsibleContent>
                                    </Collapsible>
                                </div>
                            </div>
                        )
                    )}
                </div>
            );
        case "generate_prompt":
            return (
                <PromptBlock
                    reason={contentResult?.reason}
                    prompt={contentResult?.prompt}
                />
            );
        case "find_components":
            return (
                <div>
                    <div className="mb-2">{contentResult?.message}</div>
                    <div className="flex justify-start py-1 px-1">
                        <div className="bg-gray-100 dark:bg-gray-700 text-black dark:text-white rounded-xl shadow-sm whitespace-pre-wrap w-full max-w-md">
                            <Collapsible
                                className="w-full space-y-2 my-1"
                                defaultOpen={true}
                            >
                                <div className="flex items-center justify-between space-x-4 px-4">
                                    <h4 className="text-sm font-semibold">
                                        {"Found Components"}
                                    </h4>
                                    <CollapsibleTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                            <ChevronsUpDown className="h-4 w-4" />
                                        </Button>
                                    </CollapsibleTrigger>
                                </div>
                                <CollapsibleContent className="space-y-2">
                                    <div className="px-4 pb-3">
                                        {contentResult?.componentIds &&
                                        contentResult.componentIds.length >
                                            0 ? (
                                            <ul className="divide-y divide-gray-200 dark:divide-gray-600 rounded-md overflow-hidden border border-gray-200 dark:border-gray-600">
                                                {contentResult.componentIds.map(
                                                    (
                                                        id: string,
                                                        idx: number
                                                    ) => (
                                                        <li
                                                            key={idx}
                                                            className="group flex items-center p-3 transition-colors duration-150 ease-in-out hover:bg-gray-200/70 dark:hover:bg-gray-600/70"
                                                        >
                                                            <div className="h-8 w-8 flex-shrink-0 rounded-full bg-blue-100 dark:bg-blue-900/30 mr-3 flex items-center justify-center">
                                                                <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                                                                    {idx + 1}
                                                                </span>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                                                                    {id}
                                                                </p>
                                                            </div>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                                                No components found
                                            </p>
                                        )}
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        </div>
                    </div>
                </div>
            );
        default:
            return (
                <div className="p-4">
                    <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">
                        {JSON.stringify(contentResult, null, 2)}
                    </pre>
                </div>
            );
    }
};

interface PromptBlockProps {
    reason?: string;
    prompt?: string;
}

const PromptBlock = ({ reason, prompt }: PromptBlockProps) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        if (!prompt) return;

        try {
            await navigator.clipboard.writeText(prompt);
            setCopied(true);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    useEffect(() => {
        if (copied) {
            const timer = setTimeout(() => {
                setCopied(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [copied]);
    if (!prompt) {
        return null;
    }
    return (
        <div>
            {reason && <div className="mb-2">{reason}</div>}
            <div className="relative rounded-lg overflow-hidden border border-gray-600">
                <div className="flex justify-between items-center bg-gray-800 text-gray-200 px-4 py-2">
                    <span className="text-sm font-medium">
                        Generated Prompt
                    </span>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-200 hover:text-white hover:bg-gray-700"
                        onClick={handleCopy}
                    >
                        {copied ? (
                            <Check className="h-4 w-4" />
                        ) : (
                            <Copy className="h-4 w-4" />
                        )}
                    </Button>
                </div>
                <div className="bg-gray-700 text-gray-100 p-4 overflow-x-auto">
                    <div className="markdown-content">
                        <ReactMarkdown>{prompt || ""}</ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ToolResultComponent;
