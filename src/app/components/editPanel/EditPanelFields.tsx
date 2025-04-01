import { JsonObject } from "@/app/models/types/JsonObject";
import { TextArea } from "@radix-ui/themes";
import { FaRegTrashAlt } from "react-icons/fa";

interface EditPanelFieldsProps {
    fields: Array<JsonObject>;
    handleFieldChange: (
        e: React.ChangeEvent<HTMLTextAreaElement>,
        key: string,
        index: number
    ) => void;
    handleRemoveField: (index: number) => void;
}

const EditPanelFields = ({
    fields,
    handleFieldChange,
    handleRemoveField,
}: EditPanelFieldsProps) => {
    return (
        <div className="flex flex-col space-y-4">
            {fields.map((field, index) => (
                <div key={index} className="flex justify-around bg-white">
                    {Object.entries(field).map(([key, value]) => (
                        <div
                            key={key}
                            className={`ml-2 ${
                                key === "description" || key === "acceptance"
                                    ? "w-full"
                                    : ""
                            }`}
                        >
                            <label className="text-xs text-gray-500 block mb-1">
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </label>
                            <TextArea
                                size="2"
                                resize="none"
                                radius="large"
                                placeholder={`Enter ${key}`}
                                className="bg-white"
                                value={value}
                                onChange={(e) =>
                                    handleFieldChange(e, key, index)
                                }
                            />
                        </div>
                    ))}
                    <div className="flex items-center ml-3 pt-2">
                        <button
                            className="text-xs text-red-500 hover:underline"
                            onClick={() => handleRemoveField(index)}
                        >
                            <FaRegTrashAlt />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default EditPanelFields;
