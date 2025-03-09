import { DocMode } from "@/app/models/enum/DocMode";
import { useDocModeViewModel } from "@/app/viewModels/DocModeViewModel";
import SplitView from "./SplitView";
import { EditorHeader } from "@/components/BlockEditor/EditorHeader";
import { useBlockEditor } from "@/hooks/useBlockEditor";
import { BlockEditor } from "@/components/BlockEditor/BlockEditor";
import GraphView from "../flow/GraphView";
const DocView = () => {
    const { mode, setDocMode } = useDocModeViewModel();
    const { editor } = useBlockEditor({});
    if (!editor) {
        return null;
    }
    return (
        <div className="relative flex flex-col flex-1 h-full w-full">
            <EditorHeader mode={mode as DocMode} setDocMode={setDocMode} />
            {mode === DocMode.Split ? (
                <SplitView />
            ) : mode === DocMode.Edit ? (
                <BlockEditor editor={editor} />
            ) : mode === DocMode.Graph ? (
                <GraphView />
            ) : null}
        </div>
    );
};

export default DocView;
