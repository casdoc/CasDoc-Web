"use client";

import dynamic from "next/dynamic";
import "@/app/globals.css";
import { ProjectProvider } from "@/app/viewModels/context/ProjectContext";

const DocumentContent = dynamic(
    () => import("@/app/components/DocumentContent"),
    {
        ssr: false,
    }
);

export default function Doc() {
    return (
        <ProjectProvider>
            <DocumentContent />
        </ProjectProvider>
    );
}
