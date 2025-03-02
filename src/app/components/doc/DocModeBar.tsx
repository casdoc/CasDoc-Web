import { FaEdit } from "react-icons/fa";
import { PiTreeViewLight } from "react-icons/pi";
import { RxViewVertical } from "react-icons/rx";
import { DocMode } from "../../models/enum/DocMode";
import { DocModeViewModel } from "@/app/viewModels/DocModeViewModel";

interface DocModeBarProps {
    docModeViewModel: DocModeViewModel;
}

const modes = [
    { mode: DocMode.Edit, icon: <FaEdit size={20} color="black" /> },
    { mode: DocMode.Graph, icon: <PiTreeViewLight size={20} color="black" /> },
    { mode: DocMode.Split, icon: <RxViewVertical size={20} color="black" /> },
];

const DocModeBar = ({ docModeViewModel }: DocModeBarProps) => {
    return (
        <div
            className={`mb-6 flex justify-start ${
                docModeViewModel.mode === DocMode.Split && "ml-14"
            }`}
        >
            <div className="flex w-fit py-2 px-3 rounded-lg shadow-xl bg-[#9AA6B2]">
                {modes.map(({ mode, icon }) => (
                    <button
                        disabled={mode === docModeViewModel.mode}
                        key={mode}
                        onClick={() => docModeViewModel.setDocMode(mode)}
                        className={`my-1 mx-2 p-2 rounded-lg bg-[#D9D9D9] shadow-md ${
                            mode === docModeViewModel.mode
                                ? "cursor-not-allowed bg-[#BCCCDC] opacity-30 border-white border"
                                : "hover:opacity-50"
                        }`}
                    >
                        {icon}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default DocModeBar;
