"use client";

import "@/app/globals.css";
import DocView from "@/app/components/doc/DocView";
import { EditPanel } from "@/app/components/editPanel/EditPanel";
import { NodeSelectionProvider } from "@/app/viewModels/context/NodeSelectionContext";

export default function Home() {
    return (
        <NodeSelectionProvider>
            <div className="min-w-fit h-screen flex flex-col items-center bg-gray-100 text-black">
                <DocView documentId="default-document" />
                <EditPanel />
            </div>
        </NodeSelectionProvider>
    );
}
