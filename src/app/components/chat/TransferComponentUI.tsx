import React from "react";
import UserStoryUI from "@/extensions/Templates/UserStory/UserStoryUI";
import TestCaseUI from "@/extensions/Templates/TestCase/TestCaseUI";
import DataSchemaUI from "@/extensions/Templates/DataSchema/DataSchemaUI";
import MermaidEditor from "@/app/components/doc/Mermaid/MermaidEditor";
import APIinterfaceUI from "@/extensions/Templates/APIinterface/APIinterfaceUI";
import { DataSchemaEntity } from "@/extensions/Templates/DataSchema/entity/DataSchemaEntity";
import { APIinterfaceEntity } from "@/extensions/Templates/APIinterface/entity/APIinterfaceEntity";
import { UserStoryEntity } from "@/extensions/Templates/UserStory/entity/UserStoryEntity";
import { TestCaseEntity } from "@/extensions/Templates/TestCase/entity/TestCaseEntity";
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
            const userStory = new UserStoryEntity(
                content.name || "",
                content.serial || "",
                content.tag || "",
                content.priority || "",
                content.role || "",
                content.feature || "",
                content.fields || []
            );
            return <UserStoryUI entity={userStory} toggleCheckbox={() => {}} />;

        case "testCase":
            const testCase = new TestCaseEntity(
                content.name || "",
                content.serial || "",
                content.tag || "",
                content.priority || "",
                content.description || "",
                content.fields || []
            );
            return <TestCaseUI entity={testCase} toggleCheckbox={() => {}} />;

        case "dataSchema":
            const dataSchema = new DataSchemaEntity(
                content.name || "",
                content.type || "",
                content.description || "",
                content.fields || []
            );
            return <DataSchemaUI entity={dataSchema} />;

        case "mermaid":
            return (
                <MermaidEditor
                    initialCode={content.code || ""}
                    onCodeUpdate={() => {}}
                />
            );

        case "apiInterface":
            const apiInterface = new APIinterfaceEntity(
                content.method || "unknown",
                content.name || "",
                content.description || "",
                content.endPoint || "",
                content.fields || []
            );
            return <APIinterfaceUI entity={apiInterface} />;

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
