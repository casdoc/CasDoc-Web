import React from "react";
import UserStoryUI from "@/extensions/Templates/UserStory/UserStoryUI";
import TestCaseUI from "@/extensions/Templates/TestCase/TestCaseUI";
import DataSchemaUI from "@/extensions/Templates/DataSchema/DataSchemaUI";
import MermaidEditor from "@/app/components/doc/Mermaid/MermaidEditor";
import APIinterfaceUI from "@/extensions/Templates/APIinterface/APIinterfaceUI";

interface TransferComponentUIProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    content: any;
}

export const TransferComponentUI = ({ content }: TransferComponentUIProps) => {
    if (!content) {
        return null;
    }
    switch (content.type) {
        case "userStory":
            return (
                <UserStoryUI
                    info={{
                        serial: content.serial || "",
                        name: content.name || "",
                        tag: content.tag || "",
                        priority: content.priority || "",
                        role: content.role || "",
                        feature: content.feature || "",
                    }}
                    fields={content.fields || []}
                    isTaskDone={(status) =>
                        status === "true" || status === "true"
                    }
                    toggleCheckbox={() => {}}
                />
            );

        case "testCase":
            return (
                <TestCaseUI
                    info={{
                        serial: content.serial || "",
                        name: content.name || "",
                        description: content.description || "",
                        expectedResult: content.expectedResult || "",
                    }}
                    fields={content.fields || []}
                    isTaskDone={(status = "true") =>
                        status === "true" || status === "true"
                    }
                    toggleCheckbox={() => {}}
                />
            );

        case "dataSchema":
            return (
                <DataSchemaUI
                    info={{
                        name: content.name || "",
                        type: content.type || "",
                        description: content.description || "",
                    }}
                    fields={content.fields || []}
                />
            );

        case "mermaid":
            return (
                <MermaidEditor
                    initialCode={content.code || ""}
                    onCodeUpdate={() => {}}
                />
            );

        case "apiInterface":
            return (
                <APIinterfaceUI
                    info={{
                        method: content?.method || "",
                        name: content?.name || "",
                        endPoint: content?.endPoint || "",
                        description: content?.description || "",
                    }}
                    fields={content?.fields || []}
                />
            );

        default:
            return (
                <div className="p-4">
                    <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">
                        {JSON.stringify(content, null, 2)}
                    </pre>
                </div>
            );
    }
};

export default TransferComponentUI;
