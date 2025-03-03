import { DocMode } from "@/app/models/enum/DocMode";
import { useDocModeViewModel } from "@/app/viewModels/DocModeViewModel";
import DocModeBar from "./DocModeBar";
import SplitView from "./SplitView";
import { useBlockViewModel } from "@/app/viewModels/BlockViewModel";
import SingleDoc from "./SingleDoc";

const DocView = () => {
    const docModeViewModel = useDocModeViewModel();
    const blockViewModel = useBlockViewModel();

    return (
        <div
            className={`w-full my-20 ${
                docModeViewModel.mode === DocMode.Split
                    ? "min-w-fit"
                    : "max-w-3xl"
            }`}
        >
            <DocModeBar docModeViewModel={docModeViewModel} />
            {docModeViewModel.mode === DocMode.Split ? (
                <SplitView
                    setDocMode={docModeViewModel.setDocMode}
                    blockViewModel={blockViewModel}
                />
            ) : (
                <SingleDoc
                    mode={docModeViewModel.mode}
                    blockViewModel={blockViewModel}
                />
            )}
        </div>
    );
};

export default DocView;
