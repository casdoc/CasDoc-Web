"use client";

import DocView from "@/app/components/doc/DocView";
import EditPanel from "@/app/components/editPanel/EditPanelView";
import { NodeSelectionProvider } from "@/app/viewModels/context/NodeSelectionContext";
import { useDocumentViewModel } from "@/app/viewModels/useDocument";
import { useGraphViewModel } from "@/app/viewModels/GraphViewModel";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/app/components/sidebar/AppSidebar";
import { useProjectContext } from "@/app/viewModels/context/ProjectContext";
import { Dialog } from "@/components/ui/dialog";

interface DocumentContentProps {
    documentId?: string;
}

export default function DocumentContent({ documentId }: DocumentContentProps) {
    const { selectedDocumentId } = useProjectContext();
    const activeDocumentId =
        documentId || selectedDocumentId || "default-document";

    // Use the activeDocumentId consistently
    const documentViewModel = useDocumentViewModel(activeDocumentId);
    const graphViewModel = useGraphViewModel();

    return (
        <NodeSelectionProvider>
            <SidebarProvider>
                <Dialog>
                    <AppSidebar />
                    <div className="h-dvh w-dvw flex flex-col items-center bg-gray-100 text-black">
                        <DocView
                            documentViewModel={documentViewModel}
                            graphViewModel={graphViewModel}
                        />
                        <EditPanel
                            documentViewModel={documentViewModel}
                            graphViewModel={graphViewModel}
                        />
                    </div>
                </Dialog>
            </SidebarProvider>
        </NodeSelectionProvider>
    );
}
