"use client";

import DocView from "@/app/components/doc/DocView";
import EditPanel from "@/app/components/editPanel/EditPanelView";
import { NodeSelectionProvider } from "@/app/viewModels/context/NodeSelectionContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/app/components/sidebar/AppSidebar";
import { GraphProvider } from "@/app/viewModels/context/GraphContext";
import { ChatProvider } from "@/app/viewModels/context/ChatContext";
export default function DocumentContent() {
    return (
        <GraphProvider>
            <NodeSelectionProvider>
                <SidebarProvider defaultOpen={false}>
                    <ChatProvider>
                        <AppSidebar />
                        <div className="h-dvh w-dvw flex flex-col items-center bg-gray-100 text-black">
                            <DocView />
                            <EditPanel />
                        </div>
                    </ChatProvider>
                </SidebarProvider>
            </NodeSelectionProvider>
        </GraphProvider>
    );
}
