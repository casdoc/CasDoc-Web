import React from "react";
import {
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

export interface APIinterfaceParameter {
    name: string;
    type: string;
    required: boolean;
    description: string;
}

export interface APIStatusCode {
    code: number;
    description: string;
}

interface APIinterfaceUIProps {
    info: {
        method?: string;
        name?: string;
        description?: string;
        endPoint?: string;
    };
    headers: APIinterfaceParameter[];
    queryParams: APIinterfaceParameter[];
    pathParams: APIinterfaceParameter[];
    requestBody: APIinterfaceParameter[];
    responseBody: APIinterfaceParameter[];
    statusCodes: APIStatusCode[];
}

const getMethodColor = (method?: string): string => {
    switch (method?.trim().toUpperCase()) {
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

const renderSection = (title: string, data: APIinterfaceParameter[]) => {
    if (!data.length) return null;
    return (
        <div className="pt-4">
            <h3 className="font-bold text-sm text-gray-700">{title}</h3>
            <div className="divide-y divide-gray-100">
                {data.map((field, index) => (
                    <div key={index} className="py-2">
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-800">
                                {field.name}
                            </span>
                            <div className="text-right">
                                {field.required && (
                                    <span className="text-red-500 mr-2">*</span>
                                )}
                                <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                                    {field.type}
                                </span>
                            </div>
                        </div>
                        {field.description && (
                            <p className="text-sm text-gray-500">
                                {field.description}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const APIinterfaceUI: React.FC<APIinterfaceUIProps> = ({
    info,
    headers,
    queryParams,
    pathParams,
    requestBody,
    responseBody,
    statusCodes,
}) => {
    return (
        <>
            <div className="w-full h-full pt-2 pl-4 border-b rounded-sm group/chevron">
                <div className="flex items-start pb-2 gap-1">
                    <span
                        className={`px-2 py-1 text-xs rounded-md text-white font-bold mr-2 max-w-24 truncate ${getMethodColor(
                            info?.method
                        )}`}
                    >
                        {info?.method?.toUpperCase() || "METHOD"}
                    </span>
                    <span className="text-xl font-bold text-black max-w-md overflow-x-auto">
                        {info?.name || "API name"}
                    </span>
                    <CollapsibleTrigger
                        className="w-6 h-6 bg-transparent group/chevron"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ChevronDown className="w-4 h-4 opacity-0 group-hover/chevron:opacity-100 transition-all duration-200 group-data-[state=open]/chevron:rotate-180" />
                    </CollapsibleTrigger>
                </div>
                <p className="text-sm text-gray-600">{info?.description}</p>
                <p className="text-sm font-semibold text-black py-2">
                    End Point : {info?.endPoint}
                </p>
            </div>

            <CollapsibleContent className="ml-8 overflow-hidden pb-4">
                {renderSection("Headers", headers)}
                {renderSection("Query Parameters", queryParams)}
                {renderSection("Path Parameters", pathParams)}
                {renderSection("Request Body", requestBody)}
                {renderSection("Response Body", responseBody)}

                {statusCodes.length > 0 && (
                    <div className="pt-4">
                        <h3 className="font-bold text-sm text-gray-700">
                            Status Codes
                        </h3>
                        <div className="divide-y divide-gray-100">
                            {statusCodes.map((code, index) => (
                                <div key={index} className="py-2">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-gray-800">
                                            {code.code}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        {code.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CollapsibleContent>
        </>
    );
};

export default APIinterfaceUI;
