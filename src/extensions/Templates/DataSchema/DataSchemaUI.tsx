import React from "react";
import {
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import {
    DataSchemaEntity,
    DataSchemaField,
} from "@/extensions/Templates/DataSchema/entity/DataSchemaEntity";

interface DataSchemaUIProps {
    entity: DataSchemaEntity;
}

const DataSchemaUI: React.FC<DataSchemaUIProps> = ({ entity }) => {
    const { info, fields } = entity;

    return (
        <>
            <div className="w-full h-full pt-2 pl-4 border-b rounded-sm group/chevron">
                <div className="flex justify-between">
                    <div className="flex items-center gap-1">
                        <h2 className="text-xl font-bold text-black group-hover:cursor-text">
                            {info.name || "Schema Name"}
                        </h2>
                        <CollapsibleTrigger
                            className="w-6 h-6 bg-transparent group/chevron "
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ChevronDown className="w-4 h-4 opacity-0 group-hover/chevron:opacity-100 transition-all duration-200 group-data-[state=open]/chevron:rotate-180" />
                        </CollapsibleTrigger>
                    </div>
                    <div className="flex items-center mt-1 mr-3">
                        <span className="px-2 py-1 text-xs bg-gray-100 rounded-md text-gray-700 group-hover:cursor-text">
                            {info.type || "Schema Type"}
                        </span>
                    </div>
                </div>
                <p className="mt-0 text-sm text-gray-600 group-hover:cursor-text w-fit">
                    {info.description || "Schema Description"}
                </p>
            </div>
            <CollapsibleContent className="ml-8 overflow-hidden">
                {fields && fields.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {fields.map((field: DataSchemaField, index: number) => {
                            if (
                                field.name?.trim() === "" &&
                                field.type?.trim() === "" &&
                                field.description?.trim() === ""
                            ) {
                                return null;
                            }
                            return (
                                <div key={index} className="py-2 px-4">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-gray-800 group-hover:cursor-text">
                                            {field.name}
                                        </span>
                                        {field.type && (
                                            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 group-hover:cursor-text">
                                                {field.type}
                                            </span>
                                        )}
                                    </div>
                                    {field.description && (
                                        <p className="mt-0 text-sm text-gray-500 group-hover:cursor-text w-fit">
                                            {field.description}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="p-4 text-center text-gray-400">
                        No fields yet
                    </div>
                )}
            </CollapsibleContent>
        </>
    );
};

export default DataSchemaUI;
