import { FaLaptop } from "react-icons/fa6";
import { TfiMouseAlt } from "react-icons/tfi";

interface FlowScrollModeButtonProps {
    scrollMode: "zoom" | "drag";
    handleToggleScrollMode: () => void;
}

export const FlowScrollModeButton = ({
    scrollMode,
    handleToggleScrollMode,
}: FlowScrollModeButtonProps) => {
    return (
        <button
            onClick={handleToggleScrollMode}
            className="absolute bottom-4 left-4 px-4 py-2 bg-gray-400 text-white rounded shadow hover:opacity-70 transition-colors duration-500"
        >
            {scrollMode === "zoom" ? <TfiMouseAlt /> : <FaLaptop />}
        </button>
    );
};
