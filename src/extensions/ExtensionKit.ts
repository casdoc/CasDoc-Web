"use client";

import {
    Color,
    Focus,
    FontFamily,
    Highlight,
    Heading,
    Link,
    Placeholder,
    StarterKit,
    Subscript,
    Superscript,
    SlashCommand,
    TextAlign,
    TextStyle,
    Table,
    TableCell,
    TableHeader,
    TableRow,
    Typography,
    TaskItem,
    TaskList,
    Underline,
    DataSchemaExtension,
    TopicExtension,
    APIinterfaceExtension,
    MermaidExtension,
    MarkdownPasteExtension,
    UserStoryExtension,
    TestCaseExtension,
} from ".";

export const ExtensionKit = () => [
    TaskList,
    TaskItem.configure({
        nested: true,
    }),
    Heading.configure({
        levels: [1, 2, 3, 4],
    }),
    StarterKit.configure({
        gapcursor: false, //forbid gap cursor appear between custom nodes
        heading: false,
    }),

    TextStyle,
    FontFamily,
    Color,

    Link.configure({
        openOnClick: false,
    }),
    Highlight.configure({ multicolor: true }),
    Underline,

    TextAlign.extend({
        addKeyboardShortcuts() {
            return {};
        },
    }).configure({
        types: ["heading", "paragraph"],
    }),
    Subscript,
    Superscript,
    SlashCommand,
    Table,
    TableCell,
    TableHeader,
    TableRow,
    Typography,
    Placeholder.configure({
        includeChildren: true,
        showOnlyCurrent: false,
        placeholder: () => "",
    }),
    Focus,
    DataSchemaExtension,
    TopicExtension,
    APIinterfaceExtension,
    MermaidExtension,
    MarkdownPasteExtension,
    UserStoryExtension,
    TestCaseExtension,
];

export default ExtensionKit;
