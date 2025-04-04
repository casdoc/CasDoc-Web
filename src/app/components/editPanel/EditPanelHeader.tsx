import React from "react";

interface EditPanelHeaderProps {
    type: string;
    onClose: () => void;
    section: string;
    onSectionChange: (section: string) => void;
}

const EditPanelHeader = ({
    onClose,
    section,
    onSectionChange,
    type,
}: EditPanelHeaderProps) => {
    const tabs: { key: string; label: string }[] = [
        { key: "info", label: "Info" },
        ...(type.startsWith("template")
            ? [
                  { key: "fields", label: "Fields" },
                  { key: "relations", label: "Relations" },
              ]
            : []),
    ];

    return (
        <div className="flex justify-between items-center border-b pb-2">
            <div className="flex space-x-2">
                <h2 className="text-lg font-semibold mr-4">Node Details</h2>
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => onSectionChange(tab.key)}
                        className={`text-sm px-3 py-1 rounded ${
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
