"use client";

import DocView from "@/app/components/doc/DocView";
import EditPanel from "@/app/components/editPanel/EditPanelView";
import { NodeSelectionProvider } from "@/app/viewModels/context/NodeSelectionContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/app/components/sidebar/AppSidebar";
import { useProjectContext } from "@/app/viewModels/context/ProjectContext";
import { DocumentProvider } from "@/app/viewModels/context/DocumentContext";
import { GraphProvider } from "@/app/viewModels/context/GraphContext";

// import ChatPopup from "./chat/ChatPopup";
import { ChatProvider } from "@/app/viewModels/context/ChatContext";

interface DocumentContentProps {
    documentId?: string;
}

export default function DocumentContent({ documentId }: DocumentContentProps) {
    const { selectedDocumentId } = useProjectContext();
    const activeDocumentId =
        documentId || selectedDocumentId || "default-document";

    return (
        <DocumentProvider documentId={activeDocumentId}>
            <GraphProvider>
                <NodeSelectionProvider>
                    <SidebarProvider>
                        <ChatProvider>
                            <AppSidebar />
                            <div className="h-dvh w-dvw flex flex-col items-center bg-gray-100 text-black">
                                <DocView />
                                <EditPanel />
                                {/* <ChatPopup /> */}
                            </div>
                        </ChatProvider>
                    </SidebarProvider>
                </NodeSelectionProvider>
            </GraphProvider>
        </DocumentProvider>
    );
}
