import { DocMode } from "@/app/models/enum/DocMode";
import DocModeBar from "./DocModeBar";
import Editor from "./Editor";
import Toolbar from "./ToolBar";
import Preview from "./Preview";
import GraphView from "./GraphView";
import { EditorViewModel } from "@/app/viewModels/editor/EditorViewModel";

interface SingleDocProps {
    mode: DocMode;
    setDocMode: (mode: DocMode) => void;
    oppositeMode: DocMode;
    editorViewModel: EditorViewModel;
}

const SingleDoc = ({
    mode,
    setDocMode,
    oppositeMode,
    editorViewModel,
}: SingleDocProps) => {
    return (
        <div className={`w-full max-w-3xl`}>
            <div className={`mb-6 flex justify-start`}>
                <DocModeBar
                    currentMode={mode}
                    setDocMode={setDocMode}
                    forbiddenMode={oppositeMode}
                />
            </div>

            {mode === DocMode.Edit && (
                <>
                    <Editor editorViewModel={editorViewModel} />
                    {/* <Toolbar
                        onApplyFormat={(f) => setContent((prev) => prev + f)}
                    /> */}
                </>
            )}

            {/* {mode === DocMode.Preview && <Preview content={content} />} */}
            {mode === DocMode.Graph && (
                <GraphView blocks={editorViewModel.blocks} />
            )}
        </div>
    );
};

export default SingleDoc;
