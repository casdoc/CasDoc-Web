import { JsonObject } from "@/app/models/types/JsonObject";
import { TextArea } from "@radix-ui/themes";

interface EditPanelFieldsProps {
    fields: Array<JsonObject>;
    handleFieldNameChange: (
        e: React.ChangeEvent<HTMLTextAreaElement>,
        index: number
    ) => void;
    handleFieldDescriptionChange: (
        e: React.ChangeEvent<HTMLTextAreaElement>,
        index: number
    ) => void;
    handleFieldTypeChange: (
        e: React.ChangeEvent<HTMLTextAreaElement>,
        index: number
    ) => void;
}

const EditPanelFields = ({
    fields,
    handleFieldNameChange,
    handleFieldDescriptionChange,
    handleFieldTypeChange,
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
                            onChange={(e) => handleFieldNameChange(e, index)}
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
                                handleFieldDescriptionChange(e, index)
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
                            onChange={(e) => handleFieldTypeChange(e, index)}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default EditPanelFields;
