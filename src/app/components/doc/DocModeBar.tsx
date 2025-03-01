import { FaEdit } from "react-icons/fa";
// import { GrView } from "react-icons/gr";
import { PiTreeViewLight } from "react-icons/pi";
import { RxViewVertical } from "react-icons/rx";
import { DocMode } from "../../models/enum/DocMode";

interface DocModeBarProps {
    currentMode: DocMode;
    setDocMode: (mode: DocMode) => void;
    forbiddenMode?: DocMode;
}

const modes = [
    { mode: DocMode.Edit, icon: <FaEdit size={20} color="black" /> },
    // { mode: DocMode.Preview, icon: <GrView size={20} color="black" /> },
    { mode: DocMode.Graph, icon: <PiTreeViewLight size={20} color="black" /> },
    { mode: DocMode.Split, icon: <RxViewVertical size={20} color="black" /> },
];

const DocModeBar = ({
    currentMode,
    setDocMode,
    forbiddenMode,
}: DocModeBarProps) => {
    return (
        <div className="flex w-fit py-2 px-3 rounded-lg shadow-xl bg-[#9AA6B2]">
            {modes.map(({ mode, icon }) => (
                <button
                    disabled={
                        forbiddenMode &&
                        (mode === forbiddenMode || mode === DocMode.Split)
                    }
                    key={mode}
                    onClick={() => setDocMode(mode)}
                    className={`m-1 p-2 rounded-lg hover:opacity-50 
                        ${
                            currentMode === mode
                                ? "bg-[#BCCCDC]"
                                : "bg-[#D9D9D9]"
                        } 
                        ${
                            forbiddenMode &&
                            (mode === forbiddenMode || mode === DocMode.Split)
                                ? "cursor-not-allowed"
                                : "corsor-pointer"
                        }
                    `}
                >
                    {icon}
                </button>
            ))}
        </div>
    );
};

export default DocModeBar;
