interface ToolbarProps {
    onApplyFormat: (format: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onApplyFormat }) => {
    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-fit px-5 bg-[#9AA6B2] p-3 shadow-xl z-50 rounded-lg flex">
            <button
                className="px-3 py-1 mx-1 bg-[#D9D9D9] border rounded hover:bg-[#F8FAFC]"
                onClick={() => onApplyFormat("# ")}
            >
                H1
            </button>
            <button
                className="px-3 py-1 mx-1 bg-[#D9D9D9] border rounded hover:bg-[#F8FAFC]"
                onClick={() => onApplyFormat("**bold**")}
            >
                <b>B</b>
            </button>
            <button
                className="px-3 py-1 mx-1 bg-[#D9D9D9] border rounded hover:bg-[#F8FAFC]"
                onClick={() => onApplyFormat("*italic*")}
            >
                <i>I</i>
            </button>
            <button
                className="px-3 py-1 mx-1 bg-[#D9D9D9] border rounded hover:bg-[#F8FAFC]"
                onClick={() => onApplyFormat("- ")}
            >
                List
            </button>
        </div>
    );
};

export default Toolbar;