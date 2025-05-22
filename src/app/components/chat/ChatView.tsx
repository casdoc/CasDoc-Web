import { useChatContext } from "@/app/viewModels/context/ChatContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useRef, useEffect } from "react";
import { SendHorizontal, X } from "lucide-react";
import AgentRelationAdviceDialog from "../doc/Dialog/AgentRelationAdviceDialog";
import { AgentMessage, MessageComponent } from "./handleMessageByType";
import { AgentService } from "@/app/models/services/AgentService";
import { useToast } from "@/hooks/use-toast";
import { useProjectContext } from "@/app/viewModels/context/ProjectContext";

const ChatView = () => {
    const [inputValue, setInputValue] = useState(
        "幫我寫出一些基本登入登出的api interrface"
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

    const handleOnClick = async () => {
        if (inputValue.length === 0 || isLoading) return;

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
            await AgentService.streamChat(
                userMsg.content.text || "",
                selectedProjectId || "",
                (payload) => handleMessageEvent(payload, newConversationId)
            );
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
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
    };

    // Handle different message event types with conversation ID
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleMessageEvent = (payload: any, conversationId: string) => {
        const { event, data } = payload;

        // Update messages based on event type
        setMessages((prev) => {
            // Remove thinking indicator if we're getting a real response
            const filteredMessages = prev.filter((msg) =>
                event !== "thinking" ? msg.type !== "thinking" : true
            );

            // Process message by event type
            switch (event) {
                case "user_prompt":
                    // Skip adding user message from server since we already added it in handleOnClick
                    return filteredMessages;

                case "thinking":
                    // Update existing thinking message if it exists
                    const thinkingExists = filteredMessages.some(
                        (msg) => msg.type === "thinking"
                    );
                    if (thinkingExists) {
                        return filteredMessages.map((msg) =>
                            msg.type === "thinking"
                                ? { ...msg, content: { text: data.text } }
                                : msg
                        );
                    } else {
                        return [
                            ...filteredMessages,
                            {
                                type: "thinking",
                                content: { text: data.text },
                                conversationId,
                            },
                        ];
                    }

                case "text_delta":
                    // Check if this is part of an existing text segment or a new one
                    // If there's a tool_call or tool_result after the last text_delta, create a new segment
                    let isNewSegment = true;
                    let messageSegmentId = Date.now().toString();

                    // Find the last text_delta message for this conversation
                    const textDeltaMessages = filteredMessages.filter(
                        (msg) =>
                            msg.type === "text_delta" &&
                            msg.conversationId === conversationId
                    );

                    if (textDeltaMessages.length > 0) {
                        const lastTextDeltaIndex = filteredMessages.findIndex(
                            (msg) =>
                                msg.type === "text_delta" &&
                                msg.conversationId === conversationId &&
                                msg.messageSegmentId ===
                                    textDeltaMessages[
                                        textDeltaMessages.length - 1
                                    ].messageSegmentId
                        );

                        // Check if there's any tool_call or tool_result between the last text_delta and current position
                        const hasToolBetween =
                            lastTextDeltaIndex !== -1 &&
                            filteredMessages
                                .slice(lastTextDeltaIndex + 1)
                                .some(
                                    (msg) =>
                                        (msg.type === "tool_call" ||
                                            msg.type === "tool_result") &&
                                        msg.conversationId === conversationId
                                );

                        if (!hasToolBetween && textDeltaMessages.length > 0) {
                            // Use the existing segment ID if no tool messages in between
                            isNewSegment = false;
                            messageSegmentId =
                                textDeltaMessages[textDeltaMessages.length - 1]
                                    .messageSegmentId || messageSegmentId;
                        }
                    }

                    if (isNewSegment) {
                        // Create a new text_delta message with a new segment ID
                        return [
                            ...filteredMessages,
                            {
                                type: "text_delta",
                                content: { full_text: data.full_text },
                                conversationId,
                                messageSegmentId,
                            },
                        ];
                    } else {
                        // Update the existing text_delta message with the same segment ID
                        return filteredMessages.map((msg) =>
                            msg.type === "text_delta" &&
                            msg.conversationId === conversationId &&
                            msg.messageSegmentId === messageSegmentId
                                ? {
                                      type: "text_delta",
                                      content: { full_text: data.full_text },
                                      conversationId,
                                      messageSegmentId,
                                  }
                                : msg
                        );
                    }

                case "tool_call":
                    return [
                        ...filteredMessages,
                        {
                            type: "tool_call",
                            content: {
                                tool_name: data.tool_name,
                                args: data.args,
                            },
                            conversationId,
                        },
                    ];

                case "tool_result":
                    return [
                        ...filteredMessages,
                        {
                            type: "tool_result",
                            content: {
                                tool_name: data.tool_name || "Tool Result",
                                result: data.result,
                            },
                            conversationId,
                        },
                    ];

                case "final_answer":
                    // Replace text_delta messages only from the current conversation
                    return [
                        ...filteredMessages.filter(
                            (msg) =>
                                !(
                                    msg.type === "text_delta" &&
                                    msg.conversationId === conversationId
                                )
                        ),
                        {
                            type: "final_answer",
                            content: { text: data.text },
                            conversationId,
                        },
                    ];

                case "error":
                    return [
                        ...filteredMessages,
                        {
                            type: "error",
                            content: { message: data.message },
                            conversationId,
                        },
                    ];

                default:
                    return filteredMessages;
            }
        });
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

            <div className="flex-grow w-auto mx-1 p-2 overflow-auto rounded-md bg-transparent">
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
