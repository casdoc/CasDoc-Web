import { mermaidDefaultConfig } from "../Templates/Mermaid/MermaidExtension";
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
                                level: "1",
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
            {
                name: "topic2",
                label: "Topic2",
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
                                level: "2",
                                config: {
                                    info: {
                                        name: "Topic 2",
                                        description:
                                            "This is a topic description",
                                    },
                                },
                            },
                        })
                        .run();
                },
            },
            {
                name: "topic3",
                label: "Topic3",
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
                                level: "3",
                                config: {
                                    info: {
                                        name: "Topic 3",
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
                name: "whiteBoard",
                label: "White Board",
                iconName: "SquareLibrary",
                aliases: ["whiteBoard"],
                description: "white board component of templates",
                action: (editor) => {
                    editor
                        .chain()
                        .focus()
                        .insertContent({
                            type: "template-whiteBoard",
                            attrs: {
                                topicId: "root",
                                id: uuidv4(),
                                config: {
                                    info: {
                                        name: "white board",
                                        description:
                                            "This is a white board description",
                                    },
                                    fieldKey: "description",
                                },
                            },
                        })
                        .run();
                },
            },
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
                                    fieldKey: "description",
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
                description:
                    "RESTful API interface with headers, body, and response",
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
                                        name: "User Login",
                                        method: "POST",
                                        description:
                                            "Authenticate a user with username and password",
                                        endPoint: "/api/v1/login",
                                    },
                                    headers: [
                                        {
                                            name: "Content-Type",
                                            required: true,
                                            type: "string",
                                            description:
                                                "Set to application/json",
                                        },
                                    ],
                                    queryParams: [],
                                    pathParams: [],
                                    requestBody: [
                                        {
                                            name: "username",
                                            required: true,
                                            type: "string",
                                            description: "User's account name",
                                        },
                                        {
                                            name: "password",
                                            required: true,
                                            type: "string",
                                            description: "User's password",
                                        },
                                    ],
                                    responseBody: [
                                        {
                                            name: "token",
                                            required: true,
                                            type: "string",
                                            description: "JWT access token",
                                        },
                                        {
                                            name: "expiresIn",
                                            required: true,
                                            type: "number",
                                            description:
                                                "Token expiration time in seconds",
                                        },
                                    ],
                                    statusCodes: [
                                        {
                                            code: 200,
                                            description: "Login successful",
                                        },
                                        {
                                            code: 401,
                                            description: "Invalid credentials",
                                        },
                                    ],
                                    fieldKey: "description",
                                },
                            },
                        })
                        .run();
                },
            },
            {
                name: "mermaid",
                label: "Mermaid",
                iconName: "SquareLibrary",
                aliases: ["mermaid"],
                description: "mermaid component of templates",
                action: (editor) => {
                    editor
                        .chain()
                        .focus()
                        .insertContent({
                            type: "template-mermaid",
                            attrs: {
                                topicId: "root",
                                id: uuidv4(),
                                config: {
                                    ...mermaidDefaultConfig,
                                    info: {
                                        name: "Mermaid",
                                    },
                                },
                            },
                        })
                        .run();
                },
            },
            {
                name: "userStory",
                label: "User Story",
                iconName: "SquareLibrary",
                aliases: ["userStory"],
                description: "User Story component of templates",
                action: (editor) => {
                    editor
                        .chain()
                        .focus()
                        .insertContent({
                            type: "template-userStory",
                            attrs: {
                                topicId: "root",
                                id: uuidv4(),
                                config: {
                                    info: {
                                        name: "User Login",
                                        serial: "story-01",
                                        priority: "2",
                                        tag: "login",
                                        role: "As a registered user, I would like to log in to the system.",
                                        feature:
                                            "Log in by entering your username and password to access my personal information and services.",
                                    },
                                    fields: [
                                        {
                                            acceptance:
                                                "The user can successfully log in after entering the correct account and password",
                                            done: false,
                                        },
                                    ],
                                    fieldKey: "acceptance",
                                },
                            },
                        })
                        .run();
                },
            },
            {
                name: "testCase",
                label: "Test Case",
                iconName: "SquareLibrary",
                aliases: ["testCase"],
                description: "Standard test case component",
                action: (editor) => {
                    editor
                        .chain()
                        .focus()
                        .insertContent({
                            type: "template-testCase",
                            attrs: {
                                topicId: "root",
                                id: uuidv4(),
                                config: {
                                    info: {
                                        name: "Test Login Functionality",
                                        serial: "test-01",
                                        description:
                                            "Ensure user can log in with correct credentials",
                                        expectedResult:
                                            "User is successfully redirected to dashboard after login",
                                    },
                                    fields: [
                                        {
                                            step: "Enter valid username and password",
                                            done: false,
                                        },
                                    ],
                                    fieldKey: "step",
                                },
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
