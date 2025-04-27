import { useChatContext } from "@/app/viewModels/context/ChatContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCallback, useState, useRef, useEffect } from "react";
import { SendHorizontal, X } from "lucide-react";
import AgentRelationAdviceDialog from "../doc/Dialog/AgentRelationAdviceDialog";

interface ChatMessage {
    role: string;
    content: React.ReactNode;
}

const ChatView = () => {
    const [inputValue, setInputValue] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [adviceDialogOpen, setAdviceDialogOpen] = useState(false);
    const {
        componentAddAI,
        addToAgentNodeIds,
        removeNodeFromAgent,
        setIsOpen,
    } = useChatContext();
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

    const handleCloseChat = () => {
        setIsOpen(false);
    };

    const handleOnClick = () => {
        if (inputValue.length === 0) return;
        const userMsg: ChatMessage = {
            role: "user",
            content: inputValue,
        };

        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInputValue("");

        setTimeout(() => {
            const spinnerMsg: ChatMessage = {
                role: "spinner",
                content: "",
            };
            setMessages((prev) => [...prev, spinnerMsg]);
        }, 200);
        setTimeout(() => {
            setMessages((prev) => {
                const updated = [...prev];
                updated.pop();
                return updated;
            });

            let response: React.ReactNode = "Hello! This is a demo message.";

            typedChatReply(response);
        }, 2500);
    };

    // typedChatReply function for typed effect
    function typedChatReply(fullContent: React.ReactNode) {
        const chatMsg: ChatMessage = {
            role: "chat",
            content: fullContent,
        };
        setMessages((prev) => [...prev, chatMsg]);
    }

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

    return (
        // Main container - remove specific background/blur, ensure it fills the parent
        <div className="flex flex-col justify-between w-full h-full gap-3 relative overflow-hidden">
            {/* Header with title and close button - adjust background for better contrast */}
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

            {/* Messages container - adjust padding, remove specific background */}
            <div className="flex-grow w-auto mx-4 p-4 overflow-auto rounded-md bg-transparent">
                {messages.map((msg, index) => {
                    if (msg.role === "spinner") {
                        return (
                            <div
                                key={index}
                                className="flex justify-start my-2"
                            >
                                <div className="text-black dark:text-white max-w-xs px-3 py-2 rounded-xl flex items-center">
                                    <div className="w-5 h-5 border-2 border-blue-400 dark:border-blue-500 border-t-transparent border-b-transparent rounded-full animate-spin mr-2"></div>
                                    <span className="text-sm">Thinking...</span>
                                </div>
                            </div>
                        );
                    }

                    const isUser = msg.role === "user";
                    const containerClasses = isUser
                        ? "flex justify-end my-2"
                        : "flex justify-start my-2";
                    // Use slightly more opaque backgrounds for bubbles if needed
                    const bubbleClasses = isUser
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-black dark:text-white";

                    return (
                        <div key={index} className={containerClasses}>
                            <div
                                className={`${bubbleClasses} ${
                                    msg.role === "user" && `max-w-xs`
                                } px-4 py-2.5 rounded-xl shadow-sm whitespace-pre-wrap`}
                            >
                                {msg.content}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Input area - adjust background/padding */}
            <div className="flex-shrink-0 flex rounded-lg flex-col p-3 m-1 bg-neutral-100 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200/50 dark:border-gray-700/50">
                {/* Node selection pills - moved here to be above input */}
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

                {/* Input with internal send button */}
                <div className="relative">
                    <Textarea
                        ref={textareaRef}
                        placeholder="Type your message..."
                        value={inputValue}
                        className="w-full min-h-[80px] max-h-[150px] pr-12 bg-white/70 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:ring-blue-300 dark:focus:ring-blue-600 resize-none"
                        onChange={(e) => {
                            handleOnChange(e);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleOnClick();
                            }
                        }}
                        onPaste={(e) => {
                            e.persist();
                        }}
                        rows={1} // Start with 1 row and let auto-resize handle it
                    />

                    {/* Send button inside the textarea */}
                    <Button
                        onClick={handleOnClick}
                        variant="ghost"
                        className="absolute bottom-1 right-3 p-1 h-8 w-8 rounded-md  hover:bg-neutral-200 dark:bg-blue-600 dark:hover:bg-blue-700 text-zinc-600 flex items-center justify-center"
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
