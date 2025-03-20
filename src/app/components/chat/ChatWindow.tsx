import Link from "next/link";
import { IoMdClose } from "react-icons/io";
import { MdOutlineOpenInFull } from "react-icons/md";
import { FaArrowUp } from "react-icons/fa";
import { useState } from "react";

interface ChatMessage {
    role: string;
    content: string;
}

const ChatWindow = ({ onClose }: { onClose: () => void }) => {
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
        <div className="relative w-[500px] h-[500px] bg-white border rounded-md border-gray-400 shadow-lg">
            <div className="absolute top-2 right-2 flex">
                <Link href="/chat" className="mr-2 pt-2">
                    <MdOutlineOpenInFull size={17} />
                </Link>
                <button className="text-xs px-2 py-1 rounded" onClick={onClose}>
                    <IoMdClose size={25} />
                </button>
            </div>

            <div className="absolute top-10 bottom-16 w-full overflow-auto p-2">
                {messages.map((msg, index) => {
                    if (msg.role === "spinner") {
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

            <div className="absolute flex bottom-4 px-4 w-full items-center">
                <textarea
                    placeholder="Ask some question..."
                    className="w-5/6 rounded-xl p-2 border focus:outline-none resize-none"
                    value={inputValue}
                    onChange={handleOnChange}
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

export default ChatWindow;
