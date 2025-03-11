"use client";

import "@/app/globals.css";
import DocView from "@/app/components/doc/DocView";
import { EditPanel } from "@/app/components/editPanel/EditPanel";
import { NodeSelectionProvider } from "@/app/viewModels/context/NodeSelectionContext";
import { useDocumentViewModel } from "@/hooks/useDocument";
import { useGraphViewModel } from "@/app/viewModels/GraphViewModel";

export default function Home() {
    const documentId = "default-document";
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
                    nodesData={documentViewModel.graphNodes}
                    graphViewModel={graphViewModel}
                />
            </div>
        </NodeSelectionProvider>
    );
}
