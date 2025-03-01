import { FaEdit } from "react-icons/fa";
import { PiTreeViewLight } from "react-icons/pi";
import { RxViewVertical } from "react-icons/rx";
import { DocMode } from "../../models/enum/DocMode";

interface DocModeBarProps {
    currentMode: DocMode;
    setDocMode: (mode: DocMode) => void;
}

const modes = [
    { mode: DocMode.Edit, icon: <FaEdit size={20} color="black" /> },
    { mode: DocMode.Graph, icon: <PiTreeViewLight size={20} color="black" /> },
    { mode: DocMode.Split, icon: <RxViewVertical size={20} color="black" /> },
];

const DocModeBar = ({ currentMode, setDocMode }: DocModeBarProps) => {
    return (
        <div
            className={`mb-6 flex justify-start ${
                currentMode === DocMode.Split && "ml-14"
            }`}
        >
            <div className="flex w-fit py-2 px-3 rounded-lg shadow-xl bg-[#9AA6B2]">
                {modes.map(({ mode, icon }) => (
                    <button
                        disabled={mode === currentMode}
                        key={mode}
                        onClick={() => setDocMode(mode)}
                        className={`m-1 p-2 rounded-lg hover:opacity-50 bg-[#D9D9D9] ${
                            mode === currentMode && "cursor-not-allowed"
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
