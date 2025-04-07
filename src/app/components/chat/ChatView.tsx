import { useChatContext } from "@/app/viewModels/context/ChatContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCallback, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import { X } from "lucide-react";
import AgentRelationAdviceDialog from "../doc/Dialog/AgentRelationAdviceDialog";

interface ChatMessage {
    role: string;
    content: React.ReactNode;
}

const ChatView = () => {
    const [inputValue, setInputValue] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [adviceDialogOpen, setAdviceDialogOpen] = useState(false);
    const { componentAddAI, addToAgentNodeIds, removeNodeFromAgent } =
        useChatContext();
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
            if (
                inputValue.includes("新增") &&
                inputValue.includes("刪除商店 API")
            ) {
                response = (
                    <div>
                        <div className="flex flex-row justify-between items-center mb-2">
                            <p className="font-semibold">
                                功能名稱：刪除商店 API
                            </p>
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
                        <div className="flex flex-row gap-1 items-center mt-2">
                            <Button
                                size="sm"
                                variant="default"
                                className="h-6 mt-1"
                                onClick={() =>
                                    componentAddAI(
                                        "c2ecbc7b-e1d9-4491-a85b-6605dfdf6d10",
                                        {
                                            type: "template-apiInterface",
                                            attrs: {
                                                topicId: "root",
                                                id: "407e7cf8-c10d-4654-9ab3-a84459f08823",
                                                config: {
                                                    info: {
                                                        name: "刪除商店 API",
                                                        method: "DELETE",
                                                        description:
                                                            "權限：僅限管理員或商店擁有者可操作，根據商店 ID                                  刪除指定商店，需進行身份驗證與權限檢查\n",
                                                        endPoint:
                                                            "/api/stores/:id",
                                                    },
                                                    fields: [
                                                        {
                                                            name: "status",
                                                            type: "string",
                                                            required: true,
                                                            description:
                                                                "Http request狀態碼",
                                                        },
                                                    ],
                                                    fieldKey: "description",
                                                },
                                            },
                                        }
                                    )
                                }
                            >
                                Apply
                            </Button>
                            <Button
                                onClick={onAdviceClick}
                                size="sm"
                                variant="default"
                                className="h-6 mt-1"
                            >
                                Auto Connect
                            </Button>
                        </div>
                    </div>
                );
            } else if (
                inputValue.includes("評估") &&
                inputValue.includes("user schema") &&
                inputValue.includes("開發成本")
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
                        <Button
                            size="sm"
                            variant="default"
                            className="h-6 mt-1"
                        >
                            Apply
                        </Button>
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
        <div className="flex flex-col justify-center w-full h-full bg-neutral-50 gap-3">
            <div className=" w-auto m-4 p-4 bg-white h-full rounded-md overflow-auto">
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
            {addToAgentNodeIds.length > 0 && (
                <div className="flex flex-wrap gap-2 px-4">
                    {addToAgentNodeIds.map((node) => (
                        <div
                            key={node.id}
                            className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                        >
                            <span className="mr-1">{node.title}</span>
                            <button
                                onClick={() => removeNodeFromAgent(node.id)}
                                className="hover:bg-blue-200 rounded-full p-0.5"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <div className="flex flex-row min-h-30">
                <div className="flex-grow  min-h-[120px]  my-2 ml-4 mr-0">
                    <Textarea
                        placeholder="enter some message..."
                        value={inputValue}
                        className="bg-white h-full"
                        onChange={(e) => handleOnChange(e)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleOnClick();
                            }
                        }}
                        onPaste={(e) => {
                            e.persist();
                        }}
                    />
                </div>
                <div className="flex items-center  justify-center w-auto m-2">
                    <Button onClick={handleOnClick} variant="ghost">
                        <FaArrowUp size={20} />
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
