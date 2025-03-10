"use client";

import {
    Color,
    Focus,
    FontFamily,
    Highlight,
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
    TopicComponentX,
    TemplateComponentA,
    TemplateComponentB,
} from ".";

export const ExtensionKit = () => [
    TaskList,
    TaskItem.configure({
        nested: true,
    }),

    StarterKit,

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
    TopicComponentX,
    TemplateComponentA,
    TemplateComponentB,
];

export default ExtensionKit;
