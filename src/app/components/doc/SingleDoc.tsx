import { DocMode } from "@/app/models/enum/DocMode";
import DocModeBar from "./DocModeBar";
import Editor from "./Editor";
import Toolbar from "./ToolBar";
import Preview from "./Preview";
import GraphView from "./GraphView";

interface SingleDocProps {
    content: string;
    setContent: (content: string | ((prev: string) => string)) => void;
    mode: DocMode;
    setDocMode: (mode: DocMode) => void;
    oppositeMode: DocMode;
}

const SingleDoc = ({
    content,
    setContent,
    mode,
    setDocMode,
    oppositeMode,
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
                    <Editor value={content} onChange={setContent} />
                    <Toolbar
                        onApplyFormat={(f) => setContent((prev) => prev + f)}
                    />
                </>
            )}

            {mode === DocMode.Preview && <Preview content={content} />}
            {mode === DocMode.Graph && <GraphView />}
        </div>
    );
};

export default SingleDoc;
