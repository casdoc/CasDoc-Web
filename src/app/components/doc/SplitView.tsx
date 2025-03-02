import SingleDoc from "./SingleDoc";
import { DocMode } from "@/app/models/enum/DocMode";
import { BlockViewModel } from "@/app/viewModels/BlockViewModel";

interface SplitViewProps {
    setDocMode: (mode: DocMode) => void;
    blockViewModel: BlockViewModel;
}

const SplitView = ({ blockViewModel }: SplitViewProps) => {
    return (
        <div className="flex w-full h-full ml-8">
            <div className="w-1/2 pl-4">
                <SingleDoc
                    mode={DocMode.Edit}
                    blockViewModel={blockViewModel}
                />
            </div>
            <div className="w-1/2 pr-4">
                <SingleDoc
                    mode={DocMode.Graph}
                    blockViewModel={blockViewModel}
                />
            </div>
        </div>
    );
};

export default SplitView;
