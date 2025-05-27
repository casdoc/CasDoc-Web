"use client";

import "@/app/globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "../../components/sidebar/AppSidebar";
import { Button, Flex, Text } from "@radix-ui/themes";
import OverviewHeader from "../components/OverviewHeader";
import { useProjectContext } from "@/app/viewModels/context/ProjectContext";
import { useEffect } from "react";

export default function DocumentOverviewPage() {
    const {
        selectDocument,
        selectedProjectId,
        openProjectDialog,
        openDocumentDialog,
    } = useProjectContext();

    useEffect(() => {
        selectDocument(null);
    }, [selectDocument]);

    return (
        <SidebarProvider defaultOpen={true}>
            <AppSidebar />
            <Flex
                direction="column"
                align="center"
                className="h-dvh w-dvw bg-gray-100 text-black relative"
            >
                <Flex
                    direction="column"
                    className="overflow-y-hidden relative flex-1 h-full w-full bg-white transition-all duration-500"
                >
                    <OverviewHeader />
                    <Flex
                        direction="column"
                        justify="center"
                        align="center"
                        gapY="4"
                        className="h-full"
                    >
                        <Text color="gray" size="6" weight="bold">
                            No Document Selected
                        </Text>
                        <Text color="gray" size="3">
                            Please create or choose a document to start editing.
                        </Text>
                        <Button
                            radius="medium"
                            size="2"
                            color="blue"
                            className="cursor-pointer"
                            onClick={() => {
                                if (!selectedProjectId) {
                                    openProjectDialog();
                                } else {
                                    openDocumentDialog(selectedProjectId);
                                }
                            }}
                        >
                            <Text weight="medium">
                                Create New{" "}
                                {selectedProjectId ? "Document" : "Project"}
                            </Text>
                        </Button>
                    </Flex>
                </Flex>
            </Flex>
        </SidebarProvider>
    );
}
