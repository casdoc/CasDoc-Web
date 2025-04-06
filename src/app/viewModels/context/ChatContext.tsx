import { createContext, useContext, ReactNode } from "react";
import { ChatViewModel, useChatViewModel } from "../ChatViewModel";

const ChatContext = createContext<ChatViewModel | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
    const chatViewModel = useChatViewModel();
    return (
        <ChatContext.Provider value={chatViewModel}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChatContext(): ChatViewModel {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error(
            "useChatViewModel must be used within a ChatProvider"
        );
    }
    return context;
}
