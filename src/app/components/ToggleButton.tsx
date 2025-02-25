interface ToggleButtonProps {
    isPreview: boolean;
    toggleView: () => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ isPreview, toggleView }) => {
    return (
        <button
            onClick={toggleView}
            className="px-4 py-2 rounded-lg bg-[#9AA6B2] text-white hover:opacity-50 transition"
        >
            {isPreview ? "編輯模式" : "預覽模式"}
        </button>
    );
};

export default ToggleButton;