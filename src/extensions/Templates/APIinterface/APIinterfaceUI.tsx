import React from "react";
import {
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import {
    APIinterfaceEntity,
    APIinterfaceParameter,
} from "./entity/APIinterfaceEntity";

interface APIinterfaceUIProps {
    entity: APIinterfaceEntity;
}

const getMethodColor = (method: string): string => {
    switch (method.trim().toUpperCase()) {
        case "GET":
            return "bg-green-500";
        case "POST":
            return "bg-blue-500";
        case "PUT":
            return "bg-yellow-500";
        case "DELETE":
            return "bg-red-500";
        case "PATCH":
            return "bg-purple-500";
        default:
            return "bg-gray-400";
    }
};

const APIinterfaceUI = ({ entity }: APIinterfaceUIProps) => {
    const { info, fields } = entity;
    console.debug(
        "APIinterfaceUI rendered with info:",
        info?.method,
        "fields:",
        fields
    );
    return (
        <>
            <div className="w-full h-full pt-2 pl-4 border-b rounded-sm group/chevron">
                <div className="flex items-center pb-2 gap-1">
                    <span
                        className={`px-2 py-1 text-xs rounded-md text-white font-bold mr-2 ${getMethodColor(
                            info.method
                        )}`}
                    >
                        {info?.method.toUpperCase()}
                    </span>
                    <span className="text-xl font-bold text-black group-hover:cursor-text">
                        {info.name}
                    </span>
                    <CollapsibleTrigger
                        className="w-6 h-6 bg-transparent group/chevron "
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ChevronDown className="w-4 h-4 opacity-0 group-hover/chevron:opacity-100 transition-all duration-200 group-data-[state=open]/chevron:rotate-180" />
                    </CollapsibleTrigger>
                </div>
                <div>
                    <p className="m-0 text-sm text-gray-600 group-hover:cursor-text">
                        {info?.description}
                    </p>
                    <p className="m-0 py-2 text-sm text-black font-semibold group-hover:cursor-text w-fit">
                        End Point : {info?.endPoint}
                    </p>
                </div>
            </div>
            <CollapsibleContent className="ml-8 overflow-hidden">
                {fields && fields.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {fields?.map(
                            (field: APIinterfaceParameter, index: number) => {
                                if (
                                    field.name.trim() === "" &&
                                    field.type?.trim() === "" &&
                                    field.description?.trim() === ""
                                ) {
                                    return null;
                                }
                                return (
                                    <div key={index} className="py-2 px-4">
                                        <div className="flex justify-between items-center m-0 p-0">
                                            <div className="flex items-center">
                                                <span className="font-medium text-gray-800 group-hover:cursor-text">
                                                    {field?.name}
                                                </span>
                                                {field?.required && (
                                                    <span className="text-2xl text-red-500 rounded">
                                                        *
                                                    </span>
                                                )}
                                            </div>

                                            {field.type && (
                                                <span className="text-xs bg-gray-100 px-1 py-1 rounded text-gray-600 mr-2 group-hover:cursor-text">
                                                    {field?.type}
                                                </span>
                                            )}
                                        </div>
                                        {field?.description && (
                                            <p className="m-0 p-0 text-sm text-gray-500 group-hover:cursor-text w-fit">
                                                {field?.description}
                                            </p>
                                        )}
                                    </div>
                                );
                            }
                        )}
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

export default APIinterfaceUI;
