import { Group } from "./types";
import { v4 as uuidv4 } from "uuid";

const COMPONENTS: Group[] = [
    {
        name: "topic",
        title: "Topic",
        commands: [
            {
                name: "topic",
                label: "Topic",
                iconName: "SquareLibrary",
                aliases: ["topic"],
                description: "topic component",
                action: (editor) => {
                    editor
                        .chain()
                        .focus()
                        .insertContent({
                            type: "topic",
                            attrs: {
                                documentId: "default-document",
                                id: uuidv4(),
                                config: {
                                    info: {
                                        name: "Topic",
                                        description:
                                            "This is a topic description",
                                    },
                                },
                            },
                        })
                        .run();
                },
            },
        ],
    },
    {
        name: "template",
        title: "Template",
        commands: [
            {
                name: "dataSchema",
                label: "Data Schema",
                iconName: "SquareLibrary",
                aliases: ["dataSchema"],
                description: "data schema component of templates",
                action: (editor) => {
                    editor
                        .chain()
                        .focus()
                        .insertContent({
                            type: "template-dataSchema",
                            attrs: {
                                topicId: "root",
                                id: uuidv4(),
                                config: {
                                    info: {
                                        name: "Schema",
                                        type: "Object",
                                        description:
                                            "This is a data schema description",
                                    },
                                    fields: [
                                        {
                                            name: "field",
                                            type: "default",
                                            description: "default field",
                                        },
                                    ],
                                },
                            },
                        })
                        .run();
                },
            },
            {
                name: "apiInterface",
                label: "API Interface",
                iconName: "SquareLibrary",
                aliases: ["apiInterface"],
                description: "API interface component of templates",
                action: (editor) => {
                    editor
                        .chain()
                        .focus()
                        .insertContent({
                            type: "template-apiInterface",
                            attrs: {
                                topicId: "root",
                                id: uuidv4(),
                                config: {
                                    info: {
                                        name: "API name",
                                        method: "GET",
                                        description:
                                            "This is a api interface description",
                                        endPoint: "/api/v1/demo",
                                    },
                                    fields: [
                                        {
                                            name: "id",
                                            type: "string",
                                            required: true,
                                            description:
                                                "Unique identifier for the resource",
                                        },
                                    ],
                                },
                            },
                        })
                        .run();
                },
            },
        ],
    },
];

export default COMPONENTS;
