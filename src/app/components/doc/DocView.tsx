import { DocMode } from "@/app/models/enum/DocMode";
import { useDocModeViewModel } from "@/app/viewModels/DocModeViewModel";
import { EditorHeader } from "@/components/BlockEditor/EditorHeader";
import { useBlockEditor } from "@/hooks/useBlockEditor";
import { BlockEditor } from "@/components/BlockEditor/BlockEditor";
import GraphView from "../flow/GraphView";
import { useDocumentViewModel } from "@/hooks/useDocument";

interface DocViewProps {
    documentId: string;
}

const DocView = ({ documentId }: DocViewProps) => {
    const { mode, setDocMode } = useDocModeViewModel();
    const { document, updateDocument, graphNodes } =
        useDocumentViewModel(documentId);
    const { editor } = useBlockEditor({
        document,
        updateDocument,
    });

    if (!editor || !document) {
        return null;
    }

    const editorComponent = <BlockEditor editor={editor} />;
    return (
        <div className="relative flex flex-col flex-1 h-dvh w-dvw">
            <EditorHeader mode={mode as DocMode} setDocMode={setDocMode} />
            <div className="bg-neutral-300 dark:bg-neutral-800 w-full min-w-[1.5rem] h-[1px] my-1 first:mt-0 last:mt-0" />
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
                    <GraphView graphNodes={graphNodes} />
                </div>
            </div>
        </div>
    );
};

export default DocView;
