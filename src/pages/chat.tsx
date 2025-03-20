import { TextArea } from "@radix-ui/themes";
import { useState } from "react";

function Chat() {
    const [inputValue, setInputValue] = useState("");
    const [messages, setMessages] = useState<string[]>([]);

    const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
    };

    const handleOnClick = () => {
        const newMessages = [...messages, inputValue];
        setMessages(newMessages);
        setInputValue("");
    };

    return (
        <div className="w-screen p-10">
            <div>
                {messages.map((msg, index) => {
                    return <p key={index}>{msg}</p>;
                })}
            </div>
            <div className="flex fixed bottom-3 w-full">
                <TextArea
                    size="2"
                    placeholder="enter some message..."
                    className="w-full"
                    value={inputValue}
                    onChange={(e) => handleOnChange(e)}
                />
                <button
                    onClick={handleOnClick}
                    className="bg-blue-500 p-5 rounded-lg text-white font-semibold mr-20 ml-5"
                >
                    send
                </button>
            </div>
        </div>
    );
}

export default Chat;
