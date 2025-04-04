"use client";

import dynamic from "next/dynamic";
import "@/app/globals.css";

const DocumentContent = dynamic(
    () => import("@/app/components/DocumentContent"),
    {
        ssr: false,
    }
);

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
                <ChatPopup />
            </div>
        </NodeSelectionProvider>
    );
}
