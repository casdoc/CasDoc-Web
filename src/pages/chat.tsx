import ChatView from "@/app/components/chat/ChatView";
import Link from "next/link";

function Chat() {
    return (
        <div>
            <Link
                href="/doc"
                className="fixed bg-blue-500 px-3 py-2 rounded-md text-white font-semibold m-3 hover:opacity-50 transition-opacity"
            >
                Back
            </Link>
            <ChatView />
        </div>
    );
}

export default Chat;
