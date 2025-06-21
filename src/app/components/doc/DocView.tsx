"use client";

import { useDocModeViewModel } from "@/app/viewModels/DocModeViewModel";
import { ReactFlowProvider } from "@xyflow/react";
import { useState, useEffect, useRef } from "react";
import { useProjectContext } from "@/app/viewModels/context/ProjectContext";
import EditorHeader from "@/app/components/doc/BlockEditor/EditorHeader";
import BlockEditor from "@/app/components/doc/BlockEditor/BlockEditor";
import GraphView from "../flow/GraphView";
import { Button, Flex, Text } from "@radix-ui/themes";
import DocMode from "@/app/models/enum/DocMode";
import { useQueryClient } from "@tanstack/react-query";
import { Project } from "@/app/models/entity/Project";
import { Document } from "@/app/models/entity/Document";
import { useMultiEditorContext } from "@/app/viewModels/context/MultiEditorContext";

const DocView = () => {
    const queryClient = useQueryClient();
    const { mode, setDocMode } = useDocModeViewModel();
    const {
        selectedDocumentId,
        selectedProjectId,
        openProjectDialog,
        openDocumentDialog,
    } = useProjectContext();

    const projects = queryClient.getQueryData<Project[]>(["projects"]);
    const documents =
        queryClient.getQueryData<Document[]>([
            "documents",
            selectedProjectId,
        ]) ?? [];
    const document = documents.find((doc) => doc.id === selectedDocumentId);

    const { activeEditor: editor, isLoading } = useMultiEditorContext();

    const [splitWidth, setSplitWidth] = useState(50);
    const isResizing = useRef(false);

    //handle mouse move and mouse up events for resizing the split view
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing.current) return;
            const newWidth = (e.clientX / window.innerWidth) * 100;
            if (newWidth > 20 && newWidth < 80) {
                setSplitWidth(newWidth);
            }
        };

        const handleMouseUp = () => {
            isResizing.current = false;
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    // Return loading state if document is changing
    if (!selectedDocumentId || isLoading) {
        return (
            <Flex
                direction="column"
                justify="center"
                align="center"
                className="h-full"
            >
                <Text>Loading document...</Text>
            </Flex>
        );
    }
    // Return null if editor is not loaded
    if (!editor) {
        return (
            <Flex
                direction="column"
                justify="center"
                align="center"
                className="h-full"
            >
                <Text>Connecting to editor...</Text>
            </Flex>
        );
    }

    return (
        <Flex
            direction="column"
            className="overflow-y-hidden relative flex-1 h-full w-full bg-white transition-all duration-500"
        >
            <EditorHeader
                mode={mode as DocMode}
                setDocMode={setDocMode}
                editor={editor}
                projectName={
                    projects?.find((p) => p.id === document?.projectId)?.name ||
                    ""
                }
                documentName={document?.title || ""}
            />
            {selectedDocumentId ? (
                <Flex className="overflow-y-auto h-full relative">
                    <div
                        className={`overflow-y-auto h-full ${
                            mode === DocMode.Edit ? "w-full" : ""
                        } ${mode === DocMode.Graph ? "hidden" : ""}`}
                        style={{
                            width:
                                mode === DocMode.Split
                                    ? `${splitWidth}%`
                                    : "100%",
                        }}
                    >
                        <BlockEditor editor={editor} document={document} />
                    </div>
                    {mode === DocMode.Split && (
                        <div
                            className="bg-neutral-200 dark:bg-neutral-800 h-full w-[5px] cursor-ew-resize"
                            onMouseDown={() => {
                                isResizing.current = true;
                            }}
                        />
                    )}
                    <div
                        className={`
                        ${mode === DocMode.Split ? "h-full" : ""}
                        ${mode === DocMode.Graph ? "w-full h-full" : ""}
                        ${
                            mode !== DocMode.Split && mode !== DocMode.Graph
                                ? "hidden"
                                : ""
                        }
                    `}
                        style={{
                            width:
                                mode === DocMode.Split
                                    ? `${100 - splitWidth}%`
                                    : "100%",
                        }}
                    >
                        <ReactFlowProvider>
                            <GraphView docMode={mode} />
                        </ReactFlowProvider>
                    </div>
                </Flex>
            ) : (
                <Flex
                    direction="column"
                    justify="center"
                    align="center"
                    gapY="4"
                    className="h-full"
                >
                    <Text color="gray" size="6" weight="bold">
                        No {selectedProjectId ? "Document" : "Project"} Selected
                    </Text>
                    <Text color="gray" size="3">
                        Please create a{" "}
                        {selectedProjectId ? "document" : "project"} to start
                        editing.
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
            )}
        </Flex>
    );
};

export default DocView;
