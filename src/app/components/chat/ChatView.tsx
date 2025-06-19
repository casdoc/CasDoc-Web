import { useChatContext } from "@/app/viewModels/context/ChatContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useRef, useEffect } from "react";
import { SendHorizontal, X, CircleStop } from "lucide-react";
import AgentRelationAdviceDialog from "../doc/Dialog/AgentRelationAdviceDialog";
import { AgentMessage, MessageComponent } from "./handleMessageByType";
import { AgentService } from "@/app/models/services/AgentService";
import { useToast } from "@/hooks/use-toast";
import { useProjectContext } from "@/app/viewModels/context/ProjectContext";
import { handleMessageEvent } from "./handleMessageEvent";

const ChatView = () => {
    const [inputValue, setInputValue] = useState(
        // "幫我寫出一些基本登入登出的api interrface"
        // "幫我生成一些關於user 的 data schema，包含姓名、年齡、性別、地址等欄位"
        // "Can you help me add double factor authentication to the login component?"
        "Can you help me delete the related login component?"
        // "Can you help me find components related to user authentication and generate a prompt for vibe coding?"
        // "總結目前文件的內容"
    );
    const [messages, setMessages] = useState<AgentMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [adviceDialogOpen, setAdviceDialogOpen] = useState(false);
    const { toast } = useToast();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { selectedProjectId } = useProjectContext();
    const { addToAgentNodeIds, removeNodeFromAgent, setIsOpen } =
        useChatContext();
    const [abortController, setAbortController] =
        useState<AbortController | null>(null);

    const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
    };

    const handleCloseChat = () => {
        setIsOpen(false);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleCancel = () => {
        if (abortController) {
            abortController.abort();
            setAbortController(null);
            setIsLoading(false);

            // Remove any thinking messages
            setMessages((prev) =>
                prev.filter(
                    (msg) => msg.type !== "thinking" && msg.type !== "tool_call"
                )
            );
        }
    };

    const handleOnClick = async () => {
        if (isLoading) {
            handleCancel();
            return;
        }
        if (inputValue.length === 0) return;
        // Generate a new conversation ID for this turn
        const newConversationId = Date.now().toString();
        // Add user message with conversation ID
        const userMsg: AgentMessage = {
            type: "user_prompt",
            content: { text: inputValue.replace(/\s*$/, "") },
            conversationId: newConversationId,
        };

        setMessages((prev) => [...prev, userMsg]);
        setInputValue("");
        setIsLoading(true);

        // Add thinking indicator with conversation ID
        const thinkingMsg: AgentMessage = {
            type: "thinking",
            content: { text: "Thinking..." },
            conversationId: newConversationId,
        };

        setMessages((prev) => [...prev, thinkingMsg]);

        try {
            // Create a new AbortController for this request
            const controller = new AbortController();
            setAbortController(controller);
            const response = await AgentService.chat(
                userMsg.content.text || "",
                selectedProjectId || "",
                controller.signal
            );
            if (!response) {
                throw new Error("No response from the agent service");
            }
            await AgentService.handleStreamResponse(
                response,
                controller.signal,
                (payload) =>
                    handleMessageEvent(payload, newConversationId, setMessages),
                (error) => {
                    // Only log non-abort errors
                    if (error.name !== "AbortError") {
                        console.error("Stream error:", error);
                    }
                    setIsLoading(false);
                },
                () => {
                    setIsLoading(false);
                    setAbortController(null);
                }
            );

            setIsLoading(false);
            setAbortController(null);
        } catch (error) {
            if ((error as Error).name !== "AbortError") {
                console.error("Error sending message:", error);

                setMessages((prev) => [
                    ...prev.filter((msg) => msg.type !== "thinking"),
                    {
                        type: "error",
                        content: {
                            message:
                                error instanceof Error
                                    ? error.message
                                    : "Failed to connect to the agent service",
                        },
                    },
                ]);

                toast({
                    title: "Error",
                    description: "Failed to connect to the agent service.",
                    variant: "destructive",
                });
            }

            setIsLoading(false);
            setAbortController(null);
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
            <div className="flex-shrink-0 flex justify-between items-center px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 z-20 sticky top-0 shadow-sm">
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

            <div className="flex-grow w-auto mx-1 p-2 overflow-auto rounded-md bg-transparent -mt-3 pt-5 relative z-10">
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
                        rows={1}
                    />

                    <Button
                        onClick={handleOnClick}
                        variant="ghost"
                        disabled={!isLoading && inputValue.length === 0}
                        className={`absolute bottom-1 right-3 p-1 h-8 w-8 rounded-md flex items-center justify-center 
                                hover:bg-neutral-200 dark:bg-blue-600 dark:hover:bg-blue-700 text-zinc-600`}
                    >
                        {isLoading ? (
                            <CircleStop size={16} />
                        ) : (
                            <SendHorizontal size={16} />
                        )}
                    </Button>
                </div>
            </div>

            {/* <AgentRelationAdviceDialog
                open={adviceDialogOpen}
                selectedNodeId={"407e7cf8-c10d-4654-9ab3-a84459f08823"}
                onOpenChange={setAdviceDialogOpen}
                title="AI Relationship Advice"
            /> */}
        </div>
    );
};

export default ChatView;
