import SingleDoc from "./SingleDoc";
import { DocMode } from "@/app/models/enum/DocMode";
import { EditorViewModel } from "@/app/viewModels/editor/EditorViewModel";

interface SplitViewProps {
    setDocMode: (mode: DocMode) => void;
    editorViewModel: EditorViewModel;
}

const SplitView = ({ editorViewModel }: SplitViewProps) => {
    return (
        <div className="flex w-full h-full ml-8">
            <div className="w-1/2 pl-4">
                <SingleDoc
                    mode={DocMode.Edit}
                    editorViewModel={editorViewModel}
                />
            </div>
            <div className="w-1/2 pr-4">
                <SingleDoc
                    mode={DocMode.Graph}
                    editorViewModel={editorViewModel}
                />
            </div>
        </div>
    );
};

export default SplitView;
