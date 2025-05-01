import { useChatContext } from "@/app/viewModels/context/ChatContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCallback, useState, useRef, useEffect } from "react";
import { SendHorizontal, X } from "lucide-react";
import AgentRelationAdviceDialog from "../doc/Dialog/AgentRelationAdviceDialog";
import {
    AgentMessage,
    MessageComponent,
    renderMarkdown,
} from "./handleMessageByType";
import { AgentService } from "@/app/models/services/AgentService";
import { useToast } from "@/hooks/use-toast";
import { useProjectContext } from "@/app/viewModels/context/ProjectContext";
import { ProjectData } from "@/app/viewModels/ChatViewModel";

const ChatView = () => {
    const [inputValue, setInputValue] = useState(
        // "幫我寫出user的 data shcema 和 一些基本登入登出的api interrface"
        "總結目前文件的內容"
    );
    const [messages, setMessages] = useState<AgentMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [adviceDialogOpen, setAdviceDialogOpen] = useState(false);

    const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
    };
    const onAdviceClick = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            setAdviceDialogOpen(true);
        },
        [setAdviceDialogOpen]
    );
    const { toast } = useToast();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { selectedProjectId } = useProjectContext();
    const {
        addToAgentNodeIds,
        removeNodeFromAgent,
        setIsOpen,
        getProjectAllDataById,
    } = useChatContext();
    const projectData: ProjectData | null = getProjectAllDataById(
        selectedProjectId || ""
    );

    const handleCloseChat = () => {
        setIsOpen(false);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleOnClick = async () => {
        if (inputValue.length === 0 || isLoading) return;

        // Add user message
        const userMsg: AgentMessage = {
            type: "user_prompt",
            content: { text: inputValue.replace(/\s*$/, "") },
        };

        setMessages((prev) => [...prev, userMsg]);
        setInputValue("");
        setIsLoading(true);

        // Add thinking indicator
        setMessages((prev) => [
            ...prev,
            { type: "thinking", content: { text: "Thinking..." } },
        ]);

        try {
            // const nodeIds = addToAgentNodeIds.map((node) => node.id);

            await AgentService.streamChatResponse(
                userMsg.content.text || "",
                projectData,
                // nodeIds.length > 0 ? nodeIds : undefined,
                (data) => {
                    // Skip if this is a duplicate user message
                    if (data.type === "user_prompt") {
                        return;
                    }

                    // Remove thinking indicator when we get first real response
                    if (data.type !== "thinking") {
                        setMessages((prev) =>
                            prev.filter((msg) => msg.type !== "thinking")
                        );
                    }

                    setMessages((prev) => {
                        // For text_delta, replace the previous text_delta with the updated one
                        if (data.type === "text_delta") {
                            const newMessages = [...prev];
                            const existingTextDeltaIndex =
                                newMessages.findIndex(
                                    (msg) => msg.type === "text_delta"
                                );

                            if (existingTextDeltaIndex >= 0) {
                                newMessages[existingTextDeltaIndex] = data;
                                return newMessages;
                            } else {
                                // If no existing text_delta, add this as a new message
                                return [...prev, data];
                            }
                        }

                        // For final_answer, replace any existing text_delta
                        if (data.type === "final_answer") {
                            return prev
                                .filter((msg) => msg.type !== "text_delta")
                                .concat(data);
                        }

                        // For other message types, just add them
                        return [...prev, data];
                    });
                },
                (error) => {
                    setMessages((prev) => [
                        ...prev.filter((msg) => msg.type !== "thinking"),
                        {
                            type: "error",
                            content: {
                                message: error.message || "An error occurred",
                            },
                        },
                    ]);

                    toast({
                        title: "Error",
                        description: "Failed to get a response from the agent.",
                        variant: "destructive",
                    });
                },
                () => {
                    setIsLoading(false);
                }
            );
        } catch (error) {
            setIsLoading(false);
            console.error("Error sending message:", error);

            toast({
                title: "Error",
                description: "Failed to connect to the agent service.",
                variant: "destructive",
            });
        }
    };

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea function
    const autoResizeTextarea = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            const newHeight = Math.min(
                Math.max(textarea.scrollHeight, 40),
                150
            );
            textarea.style.height = `${newHeight}px`;
        }
    };

    // Call autoResize when input value changes
    useEffect(() => {
        autoResizeTextarea();
    }, [inputValue]);

    if (!selectedProjectId) {
        return null;
    }

    return (
        <div className="flex flex-col justify-between w-full h-full gap-3 relative overflow-hidden">
            <div className="flex-shrink-0 flex justify-between items-center px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 z-10">
                <h3 className="font-medium text-gray-800 dark:text-gray-200">
                    CasDoc Agent
                </h3>
                <Button
                    onClick={handleCloseChat}
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 rounded-full"
                >
                    <X size={20} />
                </Button>
            </div>

            <div className="flex-grow w-auto mx-4 p-4 overflow-auto rounded-md bg-transparent">
                {messages.map((msg, index) => (
                    <MessageComponent
                        key={index}
                        message={msg}
                        isUser={msg.type === "user_prompt"}
                    />
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="flex-shrink-0 flex rounded-lg flex-col p-3 m-1 bg-neutral-100 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200/50 dark:border-gray-700/50">
                {addToAgentNodeIds.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                        {addToAgentNodeIds.map((node) => (
                            <div
                                key={node.id}
                                className="flex items-center bg-blue-100/80 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded-full text-sm shadow-sm"
                            >
                                <span className="mr-1">{node.title}</span>
                                <button
                                    onClick={() => removeNodeFromAgent(node.id)}
                                    className="hover:bg-blue-200/70 dark:hover:bg-blue-800/30 rounded-full p-0.5"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="relative">
                    <Textarea
                        ref={textareaRef}
                        placeholder="Ask Casdoc Agent"
                        value={inputValue}
                        className="w-full min-h-[80px] max-h-[150px] pr-12 bg-white/70 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:ring-blue-300 dark:focus:ring-blue-600 resize-none"
                        onChange={handleOnChange}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleOnClick();
                            }
                        }}
                        disabled={isLoading}
                        rows={1}
                    />

                    <Button
                        onClick={handleOnClick}
                        variant="ghost"
                        disabled={isLoading || inputValue.length === 0}
                        className="absolute bottom-1 right-3 p-1 h-8 w-8 rounded-md hover:bg-neutral-200 dark:bg-blue-600 dark:hover:bg-blue-700 text-zinc-600 flex items-center justify-center"
                    >
                        <SendHorizontal size={16} />
                    </Button>
                </div>
            </div>

            <AgentRelationAdviceDialog
                open={adviceDialogOpen}
                selectedNodeId={"407e7cf8-c10d-4654-9ab3-a84459f08823"}
                onOpenChange={setAdviceDialogOpen}
                title="AI Relationship Advice"
            />
        </div>
    );
};

export default ChatView;
