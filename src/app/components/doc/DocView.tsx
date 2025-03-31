import DocMode from "@/app/models/enum/DocMode";
import { useDocModeViewModel } from "@/app/viewModels/DocModeViewModel";
import EditorHeader from "@/app/components/doc/BlockEditor/EditorHeader";
import { useBlockEditor } from "@/app/viewModels/useBlockEditor";
import { BlockEditor } from "@/app/components/doc/BlockEditor/BlockEditor";
import GraphView from "../flow/GraphView";
import { DocumentViewModel } from "@/app/viewModels/useDocument";
import { GraphViewModel } from "@/app/viewModels/GraphViewModel";
import { ReactFlowProvider } from "@xyflow/react";
import { useState, useEffect, useRef } from "react";

interface DocViewProps {
    documentViewModel: DocumentViewModel;
    graphViewModel: GraphViewModel;
}

const DocView = ({ documentViewModel, graphViewModel }: DocViewProps) => {
    const { mode, setDocMode } = useDocModeViewModel();
    const { document, updateDocument, graphNodes } = documentViewModel;
    const { editor } = useBlockEditor({ document, updateDocument });
    const [splitWidth, setSplitWidth] = useState(50);
    const isResizing = useRef(false);

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
        <div className="relative flex flex-col flex-1 h-dvh w-dvw bg-white">
            <EditorHeader
                mode={mode as DocMode}
                setDocMode={setDocMode}
                editor={editor}
            />
            <div className="flex flex-row overflow-y-auto h-full">
                <div
                    className={`overflow-y-auto ${
                        mode === DocMode.Edit ? "w-full" : ""
                    } ${mode === DocMode.Graph ? "hidden" : ""}`}
                    style={{
                        width:
                            mode === DocMode.Split ? `${splitWidth}%` : "100%",
                    }}
                >
                    <BlockEditor editor={editor} title={document.getTitle()} />
                </div>
                {mode === DocMode.Split && (
                    <div
                        className="bg-neutral-200 dark:bg-neutral-800 h-full w-[5px] cursor-ew-resize"
                        onMouseDown={() => {
                            isResizing.current = true;
                        }}
                    ></div>
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
                        <GraphView
                            docMode={mode}
                            graphNodes={graphNodes}
                            graphViewModel={graphViewModel}
                        />
                    </ReactFlowProvider>
                </div>
            </div>
        </div>
    );
};

export default DocView;
