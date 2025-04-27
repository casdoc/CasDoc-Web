"use client";

import dynamic from "next/dynamic";
import "@/app/globals.css";
import { ProjectProvider } from "@/app/viewModels/context/ProjectContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { EditorProvider } from "@/app/viewModels/context/EditorContext";

const DocumentContent = dynamic(
    () => import("@/app/components/DocumentContent"),
    {
        ssr: false,
    }
);
const queryClient = new QueryClient();
export default function Doc() {
    return (
        <QueryClientProvider client={queryClient}>
            <ProjectProvider>
                <EditorProvider>
                    <DocumentContent />
                    <ReactQueryDevtools initialIsOpen={false} />
                </EditorProvider>
            </ProjectProvider>
        </QueryClientProvider>
    );
}
