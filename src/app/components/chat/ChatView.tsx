import { TextArea } from "@radix-ui/themes";
import { useState } from "react";
import { FaArrowUp } from "react-icons/fa";

interface ChatMessage {
    role: string;
    content: React.ReactNode;
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

            let response: React.ReactNode = "Hello! This is a demo message.";
            if (inputValue.includes("新增「刪除商店 API」的功能")) {
                response = (
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <p className="font-semibold">
                                功能名稱：刪除商店 API
                            </p>
                            <button className="bg-blue-500 text-white text-xs px-3 py-1 rounded-md hover:opacity-70 transition-opacity">
                                Apply
                            </button>
                        </div>
                        <div className="hover:opacity-70 transition-opacity">
                            <ul className="list-disc pl-5 space-y-1 text-sm">
                                <li>
                                    方法：<code>DELETE</code>
                                </li>
                                <li>
                                    路由：<code>/api/stores/:id</code>
                                </li>
                                <li>權限：僅限管理員或商店擁有者可操作</li>
                                <li>
                                    描述：根據商店 ID
                                    刪除指定商店，需進行身份驗證與權限檢查
                                </li>
                                <li>
                                    回傳結果：
                                    <ul className="list-disc pl-5">
                                        <li>200：刪除成功</li>
                                        <li>404：找不到商店</li>
                                        <li>403：無權限</li>
                                        <li>500：伺服器錯誤</li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                );
            } else if (
                inputValue.includes(
                    "評估 「user schema 新增生日屬性」的開發成本"
                )
            ) {
                response = (
                    <div className="relative">
                        <div className="flex justify-between items-center mb-2">
                            <p>
                                你需要在 <code>User Schema</code> 新增{" "}
                                <code>birth</code> 屬性，並修改兩隻 API。
                            </p>
                        </div>
                        <p className="mb-2">
                            如果有需要，我可以告訴你需要修改的實際對象，或是幫您進行修改供您套用。
                        </p>
                        <div className="hover:opacity-70 transition-opacity">
                            <ul className="list-disc pl-5 space-y-1 text-sm">
                                <li>
                                    Schema 路徑：<code>models/User.ts</code>
                                </li>
                                <li>
                                    API UpdateUserProfile：
                                    <code>PUT /api/users/:id</code>
                                    （更新使用者）
                                </li>
                                <li>
                                    API GetUserById：
                                    <code>GET /api/users/:id</code>
                                    （取得使用者）
                                </li>
                            </ul>
                        </div>
                    </div>
                );
            }

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

    return (
        <div className="flex justify-center w-screen min-h-screen p-20">
            <div className="w-2/3">
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
                                className={`${bubbleClasses} ${
                                    msg.role === "user" && `max-w-xs`
                                } px-3 py-2 rounded-xl`}
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
