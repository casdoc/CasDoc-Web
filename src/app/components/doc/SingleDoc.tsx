import { DocMode } from "@/app/models/enum/DocMode";
// import EditorView from "./EditorView";
import GraphView from "./GraphView";
// import { BlockViewModel } from "@/app/viewModels/BlockViewModel";
import { BlockEditor } from "@/components/BlockEditor/BlockEditor";

interface SingleDocProps {
    mode: DocMode;
    // blockViewModel: BlockViewModel;
}

const SingleDoc = ({ mode, blockViewModel }: SingleDocProps) => {
    return (
        <div className={`w-full max-w-3xl`}>
            {mode === DocMode.Edit && (
                // <EditorView blockViewModel={blockViewModel} />
                <BlockEditor />
            )}
            {mode === DocMode.Graph && (
                <GraphView blockViewModel={blockViewModel} />
            )}
        </div>
    );
};

export default SingleDoc;
