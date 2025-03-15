import { JsonObject } from "@/app/models/types/JsonObject";
import { TextArea } from "@radix-ui/themes";
import { FaRegTrashAlt } from "react-icons/fa";

interface EditPanelFieldsProps {
    fields: Array<JsonObject>;
    handleFieldChange: (
        e: React.ChangeEvent<HTMLTextAreaElement>,
        index: number,
        key: "name" | "description" | "type"
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
                    <div>
                        <label className="text-xs text-gray-500 block mb-1">
                            Field Name
                        </label>
                        <TextArea
                            size="2"
                            resize="none"
                            className="bg-white"
                            value={field.name}
                            onChange={(e) =>
                                handleFieldChange(e, index, "name")
                            }
                        />
                    </div>
                    <div className="ml-2 w-full">
                        <label className="text-xs text-gray-500 block mb-1">
                            Description
                        </label>
                        <TextArea
                            size="2"
                            resize="none"
                            className="bg-white"
                            value={field.description}
                            onChange={(e) =>
                                handleFieldChange(e, index, "description")
                            }
                        />
                    </div>
                    <div className="ml-2">
                        <label className="text-xs text-gray-500 block mb-1">
                            Type
                        </label>
                        <TextArea
                            size="2"
                            resize="none"
                            className="bg-white"
                            value={field.type}
                            onChange={(e) =>
                                handleFieldChange(e, index, "type")
                            }
                        />
                    </div>
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
