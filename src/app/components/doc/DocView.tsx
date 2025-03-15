import DocMode from "@/app/models/enum/DocMode";
import { useDocModeViewModel } from "@/app/viewModels/DocModeViewModel";
import EditorHeader from "@/app/components/doc/BlockEditor/EditorHeader";
import { useBlockEditor } from "@/app/viewModels/useBlockEditor";
import { BlockEditor } from "@/app/components/doc/BlockEditor/BlockEditor";
import GraphView from "../flow/GraphView";
import { DocumentViewModel } from "@/app/viewModels/useDocument";
import { GraphViewModel } from "@/app/viewModels/GraphViewModel";
import { ReactFlowProvider } from "@xyflow/react";

interface DocViewProps {
    documentViewModel: DocumentViewModel;
    graphViewModel: GraphViewModel;
}

const DocView = ({ documentViewModel, graphViewModel }: DocViewProps) => {
    const { mode, setDocMode } = useDocModeViewModel();
    const { document, updateDocument, graphNodes } = documentViewModel;
    const { editor } = useBlockEditor({
        document,
        updateDocument,
    });

    if (!editor || !document) {
        return null;
    }

    const editorComponent = (
        <BlockEditor editor={editor} title={document.getTitle()} />
    );
    return (
        <div className="relative flex flex-col flex-1 h-dvh w-dvw bg-white">
            <EditorHeader mode={mode as DocMode} setDocMode={setDocMode} />
            <div className="flex flex-row overflow-y-auto h-full">
                <div
                    className={`flex-1 overflow-y-auto ${
                        mode === DocMode.Edit ? "w-full" : ""
                    } ${mode === DocMode.Graph ? "hidden" : ""} ${
                        mode === DocMode.Split ? "w-1/2" : ""
                    }`}
                >
                    {editorComponent}
                </div>
                {mode === DocMode.Split && (
                    <div className="bg-neutral-200 dark:bg-neutral-800 h-full min-h-[1.5rem] w-[1px] mx-1 first:ml-0 last:mr-0"></div>
                )}
                <div
                    className={`${
                        mode === DocMode.Split ? "w-1/2 h-full" : ""
                    } ${mode === DocMode.Graph ? "w-full h-full" : ""} ${
                        mode !== DocMode.Split && mode !== DocMode.Graph
                            ? "hidden"
                            : ""
                    }`}
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
