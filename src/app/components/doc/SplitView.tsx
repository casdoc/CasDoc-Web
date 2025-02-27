import { useDocModeViewModel } from "@/app/viewModels/DocViewModel";
import SingleDoc from "./SingleDoc";
import { DocMode } from "@/app/models/enum/DocMode";
import { useEffect } from "react";
import { CgArrowsMergeAltH } from "react-icons/cg";

interface SplitViewProps {
    content: string;
    setContent: (content: string | ((prev: string) => string)) => void;
    setDocMode: (mode: DocMode) => void;
}

const SplitView = ({ content, setContent, setDocMode }: SplitViewProps) => {
    const { mode: leftMode, setDocMode: setLeftMode } = useDocModeViewModel();
    const { mode: rightMode, setDocMode: setRightMode } = useDocModeViewModel();

    useEffect(() => {
        setLeftMode(DocMode.Edit);
    }, []);

    return (
        <div className="flex w-full h-full ml-8">
            <div className="w-1/2 pl-4">
                <SingleDoc
                    content={content}
                    setContent={setContent}
                    mode={leftMode}
                    setDocMode={setLeftMode}
                    oppositeMode={rightMode}
                />
            </div>
            <button
                onClick={() => setDocMode(DocMode.Preview)}
                className="fixed inset-1/2 -translate-x-1/2 -translate-y-1/2 h-fit w-fit px-3 py-1 
                            bg-[#D9D9D9] border border-white rounded hover:bg-[#F8FAFC]"
            >
                <CgArrowsMergeAltH size={30} />
            </button>
            <div className="w-1/2 pr-4">
                <SingleDoc
                    content={content}
                    setContent={setContent}
                    mode={rightMode}
                    setDocMode={setRightMode}
                    oppositeMode={leftMode}
                />
            </div>
        </div>
    );
};

export default SplitView;
