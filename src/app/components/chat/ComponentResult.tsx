import React from "react";
import UserStoryUI from "@/extensions/Templates/UserStory/UserStoryUI";
import TestCaseUI from "@/extensions/Templates/TestCase/TestCaseUI";
import DataSchemaUI from "@/extensions/Templates/DataSchema/DataSchemaUI";
import MermaidEditor from "@/app/components/doc/Mermaid/MermaidEditor";
import APIinterfaceUI from "@/extensions/Templates/APIinterface/APIinterfaceUI";

interface ComponentResultProps {
    resultObj: any;
}

// Utility function to parse malformed fields array
const parseFields = (fields: string[]): any[] => {
    if (!Array.isArray(fields)) return [];

    try {
        // Handle the case where fields are split across array elements
        if (
            fields.length > 0 &&
            typeof fields[0] === "string" &&
            fields[0].startsWith("{")
        ) {
            // Join all elements into a single string
            const joinedString = fields
                .join("")
                .replace(/""/g, '","')
                .replace(/}\{/g, "},{");
            console.log("Joined String:", joinedString);
            // First attempt: try to parse as JSON array if it looks like one
            if (
                joinedString.trim().startsWith("[") &&
                joinedString.trim().endsWith("]")
            ) {
                try {
                    return JSON.parse(joinedString);
                } catch (e) {
                    console.log(
                        "Failed to parse as JSON array, trying individual objects"
                    );
                }
            }

            // Process as individual objects
            // Split by },{ to get individual objects
            const objectStrings = joinedString.split("},{");

            return objectStrings.map((objStr, index) => {
                // Add back the brackets for first and last items
                let fixedStr = objStr;
                if (index === 0 && !fixedStr.startsWith("{"))
                    fixedStr = "{" + fixedStr;
                if (
                    index === objectStrings.length - 1 &&
                    !fixedStr.endsWith("}")
                )
                    fixedStr = fixedStr + "}";
                if (index > 0 && index < objectStrings.length - 1)
                    fixedStr = "{" + fixedStr + "}";

                // Insert missing commas between properties
                fixedStr = fixedStr.replace(/"([a-zA-Z0-9_]+)""/g, '"$1",');

                // Replace Python's True/False with JSON true/false
                fixedStr = fixedStr.replace(/True/g, '"true"');
                fixedStr = fixedStr.replace(/False/g, '"false"');

                // Fix escaped quotes in strings
                fixedStr = fixedStr.replace(/\\"/g, '"');
                // Fix unescaped quotes in strings (like User"s → User's)
                fixedStr = fixedStr.replace(/([a-zA-Z])"([a-zA-Z])/g, "$1'$2");

                console.log("Fixed String:", fixedStr);

                try {
                    return JSON.parse(fixedStr);
                } catch (regexError) {
                    console.error("Regex fallback failed:", regexError);
                }

                return {
                    name: String(index),
                    type: "unknown",
                    description: "Failed to parse field data",
                };
            });
        }

        // If fields are already proper objects, return as is
        return fields;
    } catch (e) {
        console.error("Error parsing fields:", e);
        return [];
    }
};

export const ComponentResult: React.FC<ComponentResultProps> = ({
    resultObj,
}) => {
    if (!resultObj || !resultObj.type) {
        return null;
    }

    console.log("ComponentResult", resultObj);

    // Process fields if they need parsing
    const processedFields = resultObj.fields
        ? parseFields(resultObj.fields)
        : [];
    console.log("Processed Fields", processedFields);
    switch (resultObj.type) {
        case "userStory":
            return (
                <UserStoryUI
                    info={resultObj.info || {}}
                    fields={processedFields}
                    calculatePriorityStyle={(priority) => {
                        switch (priority) {
                            case 1:
                                return "bg-red-100 text-red-800 border-red-300";
                            case 2:
                                return "bg-orange-100 text-orange-800 border-orange-300";
                            case 3:
                                return "bg-yellow-100 text-yellow-800 border-yellow-300";
                            default:
                                return "bg-blue-100 text-blue-800 border-blue-300";
                        }
                    }}
                    isTaskDone={(status) =>
                        status === "true" || status === "true"
                    }
                    toggleCheckbox={() => {}}
                />
            );

        case "testCase":
            return (
                <TestCaseUI
                    info={resultObj.info || {}}
                    fields={processedFields}
                    isTaskDone={(status) =>
                        status === "true" || status === "true"
                    }
                    toggleCheckbox={() => {}}
                />
            );

        case "dataSchema":
            return (
                <DataSchemaUI
                    info={resultObj.info || {}}
                    fields={processedFields}
                />
            );

        case "mermaid":
            return (
                <MermaidEditor
                    initialCode={resultObj.code || "graph TD;\nA-->B;"}
                    onCodeUpdate={() => {}}
                />
            );

        case "apiInterface":
            return (
                <APIinterfaceUI
                    info={resultObj || {}}
                    fields={processedFields}
                />
            );

        default:
            return (
                <div className="p-4">
                    <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">
                        {JSON.stringify(resultObj, null, 2)}
                    </pre>
                </div>
            );
    }
};

export default ComponentResult;
