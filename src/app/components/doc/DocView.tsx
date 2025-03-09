import { DocMode } from "@/app/models/enum/DocMode";
import { useDocModeViewModel } from "@/app/viewModels/DocModeViewModel";
import { EditorHeader } from "@/components/BlockEditor/EditorHeader";
import { useBlockEditor } from "@/hooks/useBlockEditor";
import { BlockEditor } from "@/components/BlockEditor/BlockEditor";
import { useDocumentViewModel } from "@/hooks/useDocument";
import { cn } from "@/utils";
interface DocViewProps {
    documentId: string;
}

const DocView = ({ documentId }: DocViewProps) => {
    const { mode, setDocMode } = useDocModeViewModel();
    const { getDocumentById, updateDocument } = useDocumentViewModel();
    const document = getDocumentById(documentId);
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
        <div className="relative flex flex-col flex-1 h-dvh w-dvw ">
            <EditorHeader mode={mode as DocMode} setDocMode={setDocMode} />
            {mode === DocMode.Split ? (
                <div className="flex w-full h-full">
                    <div className="w-1/2 pl-3">
                        <BlockEditor editor={editor} />
                    </div>
                    <div className={dividerClassName}></div>
                    <div className="w-1/2 ">Graph View</div>
                </div>
            ) : mode === DocMode.Edit ? (
                <BlockEditor editor={editor} />
            ) : mode === DocMode.Graph ? (
                // <GraphView blockViewModel={blockViewModel} />
                <div>Graph View</div>
            ) : null}
        </div>
    );
};

export default DocView;
