"use client";

import DocView from "@/app/components/doc/DocView";
import EditPanel from "@/app/components/editPanel/EditPanelView";
import { NodeSelectionProvider } from "@/app/viewModels/context/NodeSelectionContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/app/components/sidebar/AppSidebar";
import { GraphProvider } from "@/app/viewModels/context/GraphContext";
import { Flex } from "@radix-ui/themes";

export default function DocumentContent() {
    return (
        <GraphProvider>
            <NodeSelectionProvider>
                <SidebarProvider defaultOpen={false}>
                    <AppSidebar />
                    <Flex
                        direction="column"
                        align="center"
                        className="h-dvh w-dvw bg-gray-100 text-black"
                    >
                        <DocView />
                        <EditPanel />
                    </Flex>
                </SidebarProvider>
            </NodeSelectionProvider>
        </GraphProvider>
    );
}
