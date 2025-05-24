"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProjectProvider } from "@/app/viewModels/context/ProjectContext";

const queryClient = new QueryClient();
export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <QueryClientProvider client={queryClient}>
            <ProjectProvider>{children}</ProjectProvider>
        </QueryClientProvider>
    );
}
