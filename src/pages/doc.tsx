"use client";

import dynamic from "next/dynamic";
import "@/app/globals.css";
import { ProjectProvider } from "@/app/viewModels/context/ProjectContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { EditorProvider } from "@/app/viewModels/context/EditorContext";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

// Enhanced Loading UI component with Progress
const LoadingMask = () => {
    const [progress, setProgress] = useState(0);

    // Simulate loading progress
    useEffect(() => {
        const timer = setTimeout(() => {
            // Increment progress, but slow down as we approach 90%
            // This simulates real loading where the last bit takes longer
            setProgress((prev) => {
                if (prev >= 100) return 100;
                if (prev >= 90) return prev + 0.2;
                if (prev >= 70) return prev + 0.5;
                return prev + 40;
            });
        }, 5);

        return () => clearTimeout(timer);
    }, [progress]);

    return (
        <div className="fixed inset-0 bg-gray-100 w-dvw h-dvh flex flex-col items-center justify-center z-50">
            <div className="flex flex-col items-center gap-6 w-1/3 max-w-md">
                <div className="text-2xl font-medium">Loading Document</div>
                <Progress value={progress} className="w-full h-2" />
                <div className="text-sm text-gray-500">
                    {progress < 100
                        ? "Preparing your document..."
                        : "Almost ready..."}
                </div>
            </div>
        </div>
    );
};

const DocumentContent = dynamic(
    () => import("@/app/components/DocumentContent"),
    {
        ssr: false,
        loading: () => <LoadingMask />,
    }
);

const queryClient = new QueryClient();
export default function Doc() {
    return (
        <QueryClientProvider client={queryClient}>
            <ProjectProvider>
                <EditorProvider>
                    <DocumentContent />
                    {/* <ReactQueryDevtools initialIsOpen={false} /> */}
                </EditorProvider>
            </ProjectProvider>
        </QueryClientProvider>
    );
}
