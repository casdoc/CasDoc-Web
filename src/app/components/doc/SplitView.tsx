import SingleDoc from "./SingleDoc";
import { DocMode } from "@/app/models/enum/DocMode";
import { BlockViewModel } from "@/app/viewModels/BlockViewModel";

interface SplitViewProps {
    setDocMode: (mode: DocMode) => void;
    blockViewModel: BlockViewModel;
}

const SplitView = ({ blockViewModel }: SplitViewProps) => {
    return (
        <div className="flex w-full h-full justify-center">
            <div className="w-5/12 mx-8">
                <SingleDoc
                    mode={DocMode.Edit}
                    blockViewModel={blockViewModel}
                />
            </div>
            <div className="w-5/12 mx-8">
                <SingleDoc
                    mode={DocMode.Graph}
                    blockViewModel={blockViewModel}
                />
            </div>
        </div>
    );
};

export default SplitView;
