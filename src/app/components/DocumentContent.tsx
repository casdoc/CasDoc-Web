"use client";

import DocView from "@/app/components/doc/DocView";
import EditPanel from "@/app/components/editPanel/EditPanelView";
import { NodeSelectionProvider } from "@/app/viewModels/context/NodeSelectionContext";
import { useDocumentViewModel } from "@/app/viewModels/useDocument";
import { useGraphViewModel } from "@/app/viewModels/GraphViewModel";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/app/components/sidebar/AppSidebar";
interface DocumentContentProps {
    documentId: string;
}

export default function DocumentContent({ documentId }: DocumentContentProps) {
    const documentViewModel = useDocumentViewModel(documentId);
    const graphViewModel = useGraphViewModel();

    return (
        <NodeSelectionProvider>
            <SidebarProvider>
                <div className="min-w-fit h-screen flex flex-col items-center bg-gray-100 text-black">
                    <AppSidebar />
                    <DocView
                        documentViewModel={documentViewModel}
                        graphViewModel={graphViewModel}
                    />
                    <EditPanel
                        documentViewModel={documentViewModel}
                        graphViewModel={graphViewModel}
                    />
                </div>
            </SidebarProvider>
        </NodeSelectionProvider>
    );
}
