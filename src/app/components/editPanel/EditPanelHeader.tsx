import React from "react";

interface EditPanelHeaderProps {
    onClose: () => void;
    section: "info" | "fields" | "relations";
    onSectionChange: (section: "info" | "fields" | "relations") => void;
}

const EditPanelHeader = ({
    onClose,
    section,
    onSectionChange,
}: EditPanelHeaderProps) => {
    const tabs: { key: "info" | "fields" | "relations"; label: string }[] = [
        { key: "info", label: "Info" },
        { key: "fields", label: "Fields" },
        { key: "relations", label: "Relations" },
    ];

    return (
        <div className="flex justify-between items-center border-b pb-2">
            <div className="flex space-x-2">
                <h2 className="text-lg font-semibold mr-4">Node Details</h2>
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => onSectionChange(tab.key)}
                        className={`text-sm px-3 py-1 rounded transition-all ${
                            section === tab.key
                                ? "bg-blue-400 text-white font-medium shadow-sm"
                                : "text-gray-600 hover:text-black"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <button
                onClick={onClose}
                className="text-gray-500 hover:text-black text-lg"
                aria-label="Close panel"
            >
                ✖
            </button>
        </div>
    );
};

export default EditPanelHeader;
