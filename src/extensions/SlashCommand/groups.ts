import { Group } from "./types";
import { v4 as uuidv4 } from "uuid";
export const GROUPS: Group[] = [
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
                                    name: "Topic",
                                    description: "This is a topic description",
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
                                    name: "API name",
                                    method: "GET",
                                    description:
                                        "This is a api interface description",
                                    uri: "/api/v1/demo",
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
                        })
                        .run();
                },
            },
        ],
    },
    {
        name: "format",
        title: "Format",
        commands: [
            {
                name: "heading1",
                label: "Heading 1",
                iconName: "Heading1",
                description: "High priority section title",
                aliases: ["h1"],
                action: (editor) => {
                    editor.chain().focus().setHeading({ level: 1 }).run();
                },
            },
            {
                name: "heading2",
                label: "Heading 2",
                iconName: "Heading2",
                description: "Medium priority section title",
                aliases: ["h2"],
                action: (editor) => {
                    editor.chain().focus().setHeading({ level: 2 }).run();
                },
            },
            {
                name: "heading3",
                label: "Heading 3",
                iconName: "Heading3",
                description: "Low priority section title",
                aliases: ["h3"],
                action: (editor) => {
                    editor.chain().focus().setHeading({ level: 3 }).run();
                },
            },
            {
                name: "bulletList",
                label: "Bullet List",
                iconName: "List",
                description: "Unordered list of items",
                aliases: ["ul"],
                action: (editor) => {
                    editor.chain().focus().toggleBulletList().run();
                },
            },
            {
                name: "numberedList",
                label: "Numbered List",
                iconName: "ListOrdered",
                description: "Ordered list of items",
                aliases: ["ol"],
                action: (editor) => {
                    editor.chain().focus().toggleOrderedList().run();
                },
            },
            {
                name: "taskList",
                label: "Task List",
                iconName: "ListTodo",
                description: "Task list with todo items",
                aliases: ["todo"],
                action: (editor) => {
                    editor.chain().focus().toggleTaskList().run();
                },
            },
            {
                name: "blockquote",
                label: "Blockquote",
                iconName: "Quote",
                description: "Element for quoting",
                action: (editor) => {
                    editor.chain().focus().setBlockquote().run();
                },
            },
            {
                name: "codeBlock",
                label: "Code Block",
                iconName: "SquareCode",
                description: "Code block with syntax highlighting",
                shouldBeHidden: (editor) => editor.isActive("columns"),
                action: (editor) => {
                    editor.chain().focus().setCodeBlock().run();
                },
            },
        ],
    },
    {
        name: "insert",
        title: "Insert",
        commands: [
            {
                name: "table",
                label: "Table",
                iconName: "Table",
                description: "Insert a table",
                shouldBeHidden: (editor) => editor.isActive("columns"),
                action: (editor) => {
                    editor
                        .chain()
                        .focus()
                        .insertTable({ rows: 3, cols: 3, withHeaderRow: false })
                        .run();
                },
            },
            {
                name: "horizontalRule",
                label: "Horizontal Rule",
                iconName: "Minus",
                description: "Insert a horizontal divider",
                aliases: ["hr"],
                action: (editor) => {
                    editor.chain().focus().setHorizontalRule().run();
                },
            },
        ],
    },
];

export default GROUPS;
