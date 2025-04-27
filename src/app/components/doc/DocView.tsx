"use client";

import { useDocModeViewModel } from "@/app/viewModels/DocModeViewModel";
import { useBlockEditor } from "@/app/viewModels/useBlockEditor";
import { ReactFlowProvider } from "@xyflow/react";
import { useState, useEffect, useRef } from "react";
import { useProjectContext } from "@/app/viewModels/context/ProjectContext";
import { useDocumentQuery } from "@/app/viewModels/hooks/useDocumentQuery";
import { useChatContext } from "@/app/viewModels/context/ChatContext";
import EditorHeader from "@/app/components/doc/BlockEditor/EditorHeader";
import BlockEditor from "@/app/components/doc/BlockEditor/BlockEditor";
import GraphView from "../flow/GraphView";
import DocMode from "@/app/models/enum/DocMode";
import z from "zod";

const DocView = () => {
    const uuidSchema = z.uuid({ version: "v4" });
    const { mode, setDocMode } = useDocModeViewModel();
    const { selectedDocumentId } = useProjectContext();
    const { data: document } = useDocumentQuery(
        selectedDocumentId,
        selectedDocumentId !== null &&
            !uuidSchema.safeParse(selectedDocumentId).success
    );
    // Initialize editor only when document is available
    const { editor, currentStatus } = useBlockEditor({
        documentId: selectedDocumentId || "",
    });
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

    // Return null if editor is not loaded - DocumentContent will handle the loading UI
    if (!editor) {
        return null;
    }

    return (
        <div
            className={`overflow-y-hidden relative flex flex-col flex-1 h-full w-full bg-white`}
        >
            <EditorHeader
                mode={mode as DocMode}
                setDocMode={setDocMode}
                editor={editor}
                editorStatus={currentStatus}
            />
            <div className="flex flex-row overflow-y-auto h-full relative">
                <div
                    className={`overflow-y-auto h-full ${
                        mode === DocMode.Edit ? "w-full" : ""
                    } ${mode === DocMode.Graph ? "hidden" : ""}`}
                    style={{
                        width:
                            mode === DocMode.Split ? `${splitWidth}%` : "100%",
                    }}
                >
                    <BlockEditor
                        editor={editor}
                        selectedDocumentId={selectedDocumentId}
                        document={document}
                    />
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
            </div>
        </div>
    );
};

export default DocView;
