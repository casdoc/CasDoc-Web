"use client";

import DocView from "@/app/components/doc/DocView";
import EditPanel from "@/app/components/editPanel/EditPanelView";
import { NodeSelectionProvider } from "@/app/viewModels/context/NodeSelectionContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/app/components/sidebar/AppSidebar";
import { GraphProvider } from "@/app/viewModels/context/GraphContext";
import { Flex } from "@radix-ui/themes";
import { ChatProvider } from "@/app/viewModels/context/ChatContext";
import ChatView from "./chat/ChatView";
import { useChatContext } from "@/app/viewModels/context/ChatContext";
import { EditorProvider } from "@/app/viewModels/context/EditorContext";
import { useProjectViewModel } from "../viewModels/ProjectViewModel";

export default function DocumentContent() {
    const { selectedDocumentId } = useProjectViewModel();
    return (
        <EditorProvider documentId={selectedDocumentId || ""}>
            <GraphProvider>
                <NodeSelectionProvider>
                    <SidebarProvider defaultOpen={false}>
                        <ChatProvider>
                            <AppSidebar />
                            <Flex
                                direction="column"
                                align="center"
                                className="h-dvh w-dvw bg-gray-100 text-black relative"
                            >
                                <DocView />
                                <EditPanel />

                                {/* Chat panel overlay with slide transition */}
                                <ChatOverlay />
                            </Flex>
                        </ChatProvider>
                    </SidebarProvider>
                </NodeSelectionProvider>
            </GraphProvider>
        </EditorProvider>
    );
}

// Separate component for the chat overlay to access context hooks
function ChatOverlay() {
    const { isOpen } = useChatContext();

    return (
        <div
            // Main positioning container
            className={`fixed top-[57px]  bottom-2 min-w-[400px] w-[680px] transform transition-transform duration-300 ease-in-out z-50 
            ${isOpen ? "translate-x-0  right-2" : "translate-x-full  right-0"}`}
        >
            <div className="shadow-xl border-2 border-neutral-300 h-full w-full rounded-lg overflow-hidden bg-neutral-50 dark:bg-gray-900">
                <ChatView />
            </div>
        </div>
    );
}
