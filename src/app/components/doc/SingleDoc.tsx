import { DocMode } from "@/app/models/enum/DocMode";
import Editor from "./Editor";
import GraphView from "./GraphView";
import { EditorViewModel } from "@/app/viewModels/editor/EditorViewModel";

interface SingleDocProps {
    mode: DocMode;
    editorViewModel: EditorViewModel;
}

const SingleDoc = ({ mode, editorViewModel }: SingleDocProps) => {
    return (
        <div className={`w-full max-w-3xl`}>
            {mode === DocMode.Edit && (
                <Editor editorViewModel={editorViewModel} />
            )}
            {mode === DocMode.Graph && (
                <GraphView blocks={editorViewModel.blocks} />
            )}
        </div>
    );
};

export default SingleDoc;
