import { PiTreeStructureLight } from "react-icons/pi";

export const FlowLayoutSetupButton = ({
    onLayout,
    selectedLayout,
}: {
    onLayout: (direction: string) => void;
    selectedLayout: string;
}) => {
    return (
        <>
            {["TB", "LR"].map((key) => (
                <button
                    disabled={true}
                    key={key}
                    onClick={() => onLayout(key)}
                    className={`bg-gray-400 mr-3 p-2 rounded-md text-white shadow-md hover:opacity-70 ${
                        key === selectedLayout && "bg-gray-500"
                    } cursor-not-allowed`}
                >
                    <PiTreeStructureLight
                        size={20}
                        className={`${key === "TB" && "rotate-90"}`}
                    />
                </button>
            ))}
        </>
    );
};
