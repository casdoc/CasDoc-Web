import { useDocModeViewModel } from "@/app/viewModels/DocViewModel";
import SingleDoc from "./SingleDoc";
import { DocMode } from "@/app/models/enum/DocMode";
import { CgArrowsMergeAltH } from "react-icons/cg";
import { EditorViewModel } from "@/app/viewModels/editor/EditorViewModel";
// import { Editor } from "./Editor";
// import Preview from "./Preview";

interface SplitViewProps {
    setDocMode: (mode: DocMode) => void;
    editorViewModel: EditorViewModel;
}

const SplitView = ({ setDocMode, editorViewModel }: SplitViewProps) => {
    const { mode: leftMode, setDocMode: setLeftMode } = useDocModeViewModel(
        DocMode.Edit
    );
    const { mode: rightMode, setDocMode: setRightMode } = useDocModeViewModel(
        DocMode.Graph
    );

    return (
        <div className="flex w-full h-full ml-8">
            <div className="w-1/2 pl-4">
                <SingleDoc
                    mode={leftMode}
                    setDocMode={setLeftMode}
                    oppositeMode={rightMode}
                    editorViewModel={editorViewModel}
                />
            </div>
            <button
                onClick={() => setDocMode(DocMode.Edit)}
                className="fixed inset-1/2 -translate-x-1/2 -translate-y-1/2 h-fit w-fit px-3 py-1 
                            bg-[#D9D9D9] border border-white rounded hover:bg-[#F8FAFC]"
            >
                <CgArrowsMergeAltH size={30} />
            </button>
            <div className="w-1/2 pr-4">
                <SingleDoc
                    mode={rightMode}
                    setDocMode={setRightMode}
                    oppositeMode={leftMode}
                    editorViewModel={editorViewModel}
                />
            </div>
        </div>
    );
};

export default SplitView;
