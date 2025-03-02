import { DocMode } from "@/app/models/enum/DocMode";
import EditorView from "./EditorView";
import GraphView from "./GraphView";
import { BlockViewModel } from "@/app/viewModels/BlockViewModel";

interface SingleDocProps {
    mode: DocMode;
    blockViewModel: BlockViewModel;
}

const SingleDoc = ({ mode, blockViewModel }: SingleDocProps) => {
    return (
        <div className={`w-full max-w-3xl`}>
            {mode === DocMode.Edit && (
                <EditorView blockViewModel={blockViewModel} />
            )}
            {mode === DocMode.Graph && (
                <GraphView blocks={blockViewModel.blocks} />
            )}
        </div>
    );
};

export default SingleDoc;
