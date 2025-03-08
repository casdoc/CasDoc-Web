"use client";

import "@/app/globals.css";
import DocView from "@/app/components/doc/DocView";
import { EditPanel } from "@/app/components/editPanel/EditPanel";
import { NodeSelectionProvider } from "@/app/viewModels/NodeSelectionContext";

export default function Home() {
    return (
        <NodeSelectionProvider>
            <div className="min-w-fit min-h-screen flex flex-col items-center bg-gray-100 text-black">
                <DocView />
                <EditPanel />
            </div>
        </NodeSelectionProvider>
    );
}
