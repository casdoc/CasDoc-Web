import ChatView from "@/app/components/chat/ChatView";
import Link from "next/link";

function Chat() {
    return (
        <div>
            <Link href="/doc">Back</Link>
            <ChatView />
        </div>
    );
}

export default Chat;
