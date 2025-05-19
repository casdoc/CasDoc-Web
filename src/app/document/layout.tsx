"use client";

import { SocketContext } from "@/app/viewModels/context/SocketContext";
import { HocuspocusProviderWebsocket } from "@hocuspocus/provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ProjectProvider } from "@/app/viewModels/context/ProjectContext";

const queryClient = new QueryClient();
export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [socket, setSocket] = useState<HocuspocusProviderWebsocket | null>(
        null
    );
    useEffect(() => {
        const newlyCreatedSocket = new HocuspocusProviderWebsocket({
            url: "ws://localhost:1234", // Changed from 3000 to 1234 to match your Hocuspocus server port
        });

        setSocket(newlyCreatedSocket);

        return () => {
            newlyCreatedSocket?.destroy();
        };
    }, []);

    // Add loading state to prevent rendering until socket is available
    if (!socket) {
        return (
            <div className="h-screen w-screen flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                <span className="ml-2">Connecting to server...</span>
            </div>
        );
    }

    return (
        <QueryClientProvider client={queryClient}>
            <ProjectProvider>
                <SocketContext value={socket}>{children}</SocketContext>
            </ProjectProvider>
        </QueryClientProvider>
    );
}
