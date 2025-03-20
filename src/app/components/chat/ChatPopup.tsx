import { FaSnapchat } from "react-icons/fa6";

import { useState } from "react";
import ChatWindow from "./ChatWindow";

const ChatPopup = () => {
    const [open, setOpen] = useState(false);
    return (
        <div className="fixed left-5 bottom-5 ">
            {open ? (
                <ChatWindow onClose={() => setOpen(false)} />
            ) : (
                <button
                    onClick={() => setOpen(true)}
                    className="border-2 border-black rounded-full p-2 hover:opacity-60"
                >
                    <FaSnapchat size={25} />
                </button>
            )}
        </div>
    );
};

export default ChatPopup;
