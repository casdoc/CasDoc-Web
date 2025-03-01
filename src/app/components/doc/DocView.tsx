import { DocMode } from "@/app/models/enum/DocMode";
import {
    useDocContentViewModel,
    useDocModeViewModel,
} from "@/app/viewModels/DocViewModel";
import DocModeBar from "./DocModeBar";
import Editor from "./Editor";
import Toolbar from "./ToolBar";
import Preview from "./Preview";
import GraphView from "./GraphView";
import SplitView from "./SplitView";

const DocView = () => {
    const { content, setContent } = useDocContentViewModel();
    const { mode, setDocMode } = useDocModeViewModel();

    return (
        <div
            className={`w-full my-20 ${
                mode === DocMode.Split ? "min-w-fit" : "max-w-3xl"
            }`}
        >
            {mode !== DocMode.Split && (
                <div className={`mb-6 flex justify-start`}>
                    <DocModeBar currentMode={mode} setDocMode={setDocMode} />
                </div>
            )}

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
            {mode === DocMode.Split && (
                <SplitView
                    content={content}
                    setContent={setContent}
                    setDocMode={setDocMode}
                />
            )}
        </div>
    );
};

export default DocView;
