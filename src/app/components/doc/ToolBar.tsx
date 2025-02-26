interface ToolbarProps {
    onApplyFormat: (format: string) => void;
}

const formatOptions = [
    { label: "H1", format: "# " },
    { label: <b>B</b>, format: "**bold**" },
    { label: <i>I</i>, format: "*italic*" },
    { label: "List", format: "- " },
    { label: "+", format: "the template feature is under construction" },
];

const Toolbar = ({ onApplyFormat }: ToolbarProps) => {
    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-fit px-5 bg-[#9AA6B2] p-3 shadow-xl z-50 rounded-lg flex">
            {formatOptions.map(({ label, format }) => (
                <button
                    disabled={label === "+"}
                    key={format}
                    className={`px-3 py-1 mx-1 bg-[#D9D9D9] border rounded hover:bg-[#F8FAFC]
                        ${
                            label === "+"
                                ? "opacity-30 cursor-not-allowed"
                                : "cursor-pointer"
                        }`}
                    onClick={() => onApplyFormat(format)}
                >
                    {label}
                </button>
            ))}
        </div>
    );
};

export default Toolbar;
