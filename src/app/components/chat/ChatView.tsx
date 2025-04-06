import { TextArea } from "@radix-ui/themes";
import { useState } from "react";
import { FaArrowUp } from "react-icons/fa";

interface ChatMessage {
    role: string;
    content: string;
}

const ChatView = () => {
    const [inputValue, setInputValue] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
    };

    const handleOnClick = () => {
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
            typedChatReply("Hello! This is a demo message.");
        }, 1000);
    };

    // typedChatReply function for typed effect
    function typedChatReply(fullText: string) {
        const chatMsg: ChatMessage = {
            role: "chat",
            content: "",
        };
        setMessages((prev) => [...prev, chatMsg]);

        let index = 0;
        let typed = "";

        const intervalId = setInterval(() => {
            typed += fullText[index];
            index++;
            setMessages((prev) => {
                const updated = [...prev];
                const lastMsgIndex = updated.length - 1;
                updated[lastMsgIndex] = {
                    ...updated[lastMsgIndex],
                    content: typed,
                };
                return updated;
            });

            if (index >= fullText.length) {
                clearInterval(intervalId);
            }
        }, 40);
    }

    return (
        <div className="flex justify-center w-screen h-screen p-20">
            <div className="w-2/3">
                {messages.map((msg, index) => {
                    if (msg.role === "chatSpinner") {
                        return (
                            <div
                                key={index}
                                className="flex justify-start my-2"
                            >
                                <div className="text-black max-w-xs px-3 py-2 rounded-xl flex items-center">
                                    <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent border-b-transparent rounded-full animate-spin mr-2"></div>
                                    <span className="text-sm">Thinking...</span>
                                </div>
                            </div>
                        );
                    }

                    const isUser = msg.role === "user";
                    const containerClasses = isUser
                        ? "flex justify-end my-2"
                        : "flex justify-start my-2";
                    const bubbleClasses = isUser
                        ? "bg-blue-500 text-white"
                        : "text-black";

                    return (
                        <div key={index} className={containerClasses}>
                            <div
                                className={`${bubbleClasses} max-w-xs px-3 py-2 rounded-xl`}
                            >
                                {msg.content}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="flex items-center justify-center fixed bottom-8 w-full">
                <TextArea
                    size="2"
                    placeholder="enter some message..."
                    className="w-2/3 rounded-xl"
                    value={inputValue}
                    onChange={(e) => handleOnChange(e)}
                    onKeyDown={(e) => {
                        if (inputValue.trim() === "") return;
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleOnClick();
                        }
                    }}
                />
                <button
                    onClick={handleOnClick}
                    className="h-fit bg-blue-500 rounded-full shadow-xl text-white font-semibold mx-5 p-3 hover:opacity-60 transition-opacity"
                >
                    <FaArrowUp size={20} />
                </button>
            </div>
        </div>
    );
};

export default ChatView;
