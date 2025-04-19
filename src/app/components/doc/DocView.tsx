import DocMode from "@/app/models/enum/DocMode";
import { useDocModeViewModel } from "@/app/viewModels/DocModeViewModel";
import EditorHeader from "@/app/components/doc/BlockEditor/EditorHeader";
import { useBlockEditor } from "@/app/viewModels/useBlockEditor";
import { BlockEditor } from "@/app/components/doc/BlockEditor/BlockEditor";
import GraphView from "../flow/GraphView";
import { ReactFlowProvider } from "@xyflow/react";
import { useState, useEffect, useRef } from "react";
import { useDocumentContext } from "@/app/viewModels/context/DocumentContext";
import { useGraphContext } from "@/app/viewModels/context/GraphContext";

const DocView = () => {
    const { mode, setDocMode } = useDocModeViewModel();
    const { document, graphNodes, updateDocument } = useDocumentContext();
    const { setGraphNodes } = useGraphContext();
    const { editor } = useBlockEditor({ document, updateDocument });
    const [splitWidth, setSplitWidth] = useState(50);
    const isResizing = useRef(false);

    useEffect(() => {
        setGraphNodes(graphNodes);
    }, [setGraphNodes, graphNodes]);

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

    if (!editor || !document) {
        return null;
    }

    return (
        <div
            className={`overflow-y-hidden relative flex flex-col flex-1 h-full w-full bg-white transition-all duration-500
               `}
        >
            <EditorHeader
                mode={mode as DocMode}
                setDocMode={setDocMode}
                editor={editor}
            />
            <div className="flex flex-row overflow-y-auto h-full">
                <div
                    className={`overflow-y-auto h-full ${
                        mode === DocMode.Edit ? "w-full" : ""
                    } ${mode === DocMode.Graph ? "hidden" : ""}`}
                    style={{
                        width:
                            mode === DocMode.Split ? `${splitWidth}%` : "100%",
                    }}
                >
                    <BlockEditor editor={editor} title={document.title} />
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
