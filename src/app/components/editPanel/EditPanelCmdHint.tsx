const EditPanelCmdHint = () => {
    return (
        <div className="flex flex-col items-end mx-2 my-5">
            <div className="flex px-1 text-gray-400 text-sm my-1">
                Next text area
                <div className="flex bg-gray-400 opacity-90 text-white text-xs p-1 rounded-sm ml-1.5">
                    Tab
                </div>
            </div>
            <div className="flex px-1 text-gray-400 text-sm my-1">
                Close
                <div className="flex bg-gray-400 opacity-90 text-white text-xs p-1 rounded-sm ml-1.5">
                    esc
                </div>
            </div>
        </div>
    );
};

export default EditPanelCmdHint;
