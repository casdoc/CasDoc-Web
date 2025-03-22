import { TextArea } from "@radix-ui/themes";

interface EditPanelInfoProps {
    selectedNode: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    info: any;
    handleConfigChange: (
        e: React.ChangeEvent<HTMLTextAreaElement>,
        key: string
    ) => void;
}

const EditPanelInfo = ({
    selectedNode,
    info,
    handleConfigChange,
}: EditPanelInfoProps) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mr-4 shadow">
            <h2 className="text-lg font-semibold mb-4">Basic Info</h2>
            <p className="text-sm text-gray-500 mb-4">
                <span className="font-semibold">ID:</span> {selectedNode}
            </p>
            {info && Object.keys(info).length > 0 ? (
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {Object.entries(info).map(([key, value]) => (
                        <div key={key} className="flex flex-col space-y-1">
                            <label
                                className="text-sm text-gray-600 font-medium truncate"
                                title={key}
                            >
                                {key}
                            </label>
                            <TextArea
                                size="2"
                                resize="none"
                                radius="medium"
                                className="resize-none bg-white p-2 text-sm w-full border border-gray-300 rounded-md focus:ring focus:ring-indigo-200"
                                value={value !== undefined ? String(value) : ""}
                                onChange={(e) => handleConfigChange(e, key)}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-sm">No config fields</p>
            )}
        </div>
    );
};

export default EditPanelInfo;
