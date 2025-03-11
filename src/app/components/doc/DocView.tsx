import { DocMode } from "@/app/models/enum/DocMode";
import { useDocModeViewModel } from "@/app/viewModels/DocModeViewModel";
import { EditorHeader } from "@/components/BlockEditor/EditorHeader";
import { useBlockEditor } from "@/hooks/useBlockEditor";
import { BlockEditor } from "@/components/BlockEditor/BlockEditor";
import GraphView from "../flow/GraphView";
import { DocumentViewModel } from "@/hooks/useDocument";
import { cn } from "@/utils";
import { GraphViewModel } from "@/app/viewModels/GraphViewModel";

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
    const dividerClassName = cn(
        "bg-neutral-200 dark:bg-neutral-800 h-full min-h-[1.5rem] w-[1px] mx-1 first:ml-0 last:mr-0"
    );
    return (
        <div className="relative flex flex-col flex-1 h-full w-full">
            <EditorHeader mode={mode as DocMode} setDocMode={setDocMode} />
            {mode === DocMode.Split ? (
                <div className="flex w-screen h-full">
                    <div className="w-1/2 pl-2">
                        <BlockEditor key={`editor-${mode}`} editor={editor} />
                    </div>
                    <div className={dividerClassName}></div>
                    <div className="w-1/2 flex-1 overflow-y-auto h-full">
                        <GraphView
                            graphNodes={graphNodes}
                            graphViewModel={graphViewModel}
                        />
                    </div>
                </div>
            ) : mode === DocMode.Edit ? (
                <BlockEditor key={`editor-${mode}`} editor={editor} />
            ) : mode === DocMode.Graph ? (
                <GraphView
                    graphNodes={graphNodes}
                    graphViewModel={graphViewModel}
                />
            ) : null}
        </div>
    );
};

export default DocView;
