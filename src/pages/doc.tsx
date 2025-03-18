"use client";

import "@/app/globals.css";
import DocView from "@/app/components/doc/DocView";
import EditPanel from "@/app/components/editPanel/EditPanelView";
import { NodeSelectionProvider } from "@/app/viewModels/context/NodeSelectionContext";
import { useDocumentViewModel } from "@/app/viewModels/useDocument";
import { useGraphViewModel } from "@/app/viewModels/GraphViewModel";

export default function Doc() {
    const documentId = "default-document";

    return <DocumentContent documentId={documentId} />;
}

function DocumentContent({ documentId }: { documentId: string }) {
    const documentViewModel = useDocumentViewModel(documentId);
    const graphViewModel = useGraphViewModel();

    return (
        <NodeSelectionProvider>
            <div className="min-w-fit h-screen flex flex-col items-center bg-gray-100 text-black">
                <DocView
                    documentViewModel={documentViewModel}
                    graphViewModel={graphViewModel}
                />
                <EditPanel
                    documentViewModel={documentViewModel}
                    graphViewModel={graphViewModel}
                />
            </div>
        </NodeSelectionProvider>
    );
}
