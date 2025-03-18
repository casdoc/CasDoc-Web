const EditPanelHeader = ({ onClose }: { onClose: () => void }) => {
    return (
        <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-lg font-semibold">Node Details</h2>
            <button
                onClick={onClose}
                className="text-gray-500 hover:text-black"
            >
                ✖
            </button>
        </div>
    );
};

export default EditPanelHeader;
