import { DocMode } from "@/app/models/enum/DocMode";
import { useDocModeViewModel } from "@/app/viewModels/DocViewModel";
import DocModeBar from "./DocModeBar";
import SplitView from "./SplitView";
import { useEditorViewModel } from "@/app/viewModels/editor/EditorViewModel";
import SingleDoc from "./SingleDoc";

const DocView = () => {
    const { mode, setDocMode } = useDocModeViewModel(DocMode.Edit);
    const editorViewModel = useEditorViewModel();

    return (
        <div
            className={`w-full my-20 ${
                mode === DocMode.Split ? "min-w-fit" : "max-w-3xl"
            }`}
        >
            <DocModeBar currentMode={mode} setDocMode={setDocMode} />
            {mode === DocMode.Split ? (
                <SplitView
                    setDocMode={setDocMode}
                    editorViewModel={editorViewModel}
                />
            ) : (
                <SingleDoc mode={mode} editorViewModel={editorViewModel} />
            )}
        </div>
    );
};

export default DocView;
