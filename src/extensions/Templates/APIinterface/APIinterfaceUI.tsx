import React from "react";
import {
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { Flex, Text } from "@radix-ui/themes";

export interface APIinterfaceParameter {
    name: string;
    type: string;
    required: boolean;
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
    requestBody: APIinterfaceParameter[];
    responseBody: APIinterfaceParameter[];
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
        <div className="py-3">
            <h3 className="font-bold text-sm text-gray-700 py-0">{title}</h3>
            <ul className="divide-gray-100 mt-2 px-2">
                {data.map((field, index) => (
                    <li key={index}>
                        <Flex justify="between" align="center" pl="2">
                            <Flex align="center" gap="2">
                                <span className="font-medium text-gray-800">
                                    {field.name}
                                </span>
                                {field.description && (
                                    <span className="text-sm text-gray-500">
                                        {field.description}
                                    </span>
                                )}
                            </Flex>
                            <div className="text-right pr-2">
                                {field.required && (
                                    <span className="text-red-500 mr-0.5">
                                        *
                                    </span>
                                )}
                                <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                                    {field.type}
                                </span>
                            </div>
                        </Flex>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const APIinterfaceUI = ({
    info,
    headers,
    requestBody,
    responseBody,
}: APIinterfaceUIProps) => {
    return (
        <>
            <div className="pt-2 pl-4 border-b rounded-sm group/chevron">
                <Flex align="center" pb="2" gap="1">
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
                </Flex>
                <Flex direction="column">
                    <Text className="text-sm text-gray-600">
                        {info?.description}
                    </Text>
                    <Text className="text-sm font-semibold text-black py-2">
                        End Point : {info?.endPoint}
                    </Text>
                </Flex>
            </div>
            <CollapsibleContent className="ml-4 overflow-hidden">
                {renderSection("Headers", headers)}
                {renderSection("Request Body", requestBody)}
                {renderSection("Response Body", responseBody)}
            </CollapsibleContent>
        </>
    );
};

export default APIinterfaceUI;
