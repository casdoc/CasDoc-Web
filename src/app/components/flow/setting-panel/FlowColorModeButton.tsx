import { FaRegMoon } from "react-icons/fa";
import { IoSunny } from "react-icons/io5";

export const FlowColorModeButton = ({
    mode,
    setMode,
}: {
    mode: "light" | "dark";
    setMode: (mode: "light" | "dark") => void;
}) => {
    return (
        <button
            onClick={() => setMode(mode === "light" ? "dark" : "light")}
            className="bg-gray-400 mr-3 p-2 rounded-md text-white shadow-md hover:opacity-70"
        >
            {mode === "dark" ? <FaRegMoon size={20} /> : <IoSunny size={20} />}
        </button>
    );
};
