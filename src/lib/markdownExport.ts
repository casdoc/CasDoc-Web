import { Editor } from "@tiptap/react";
import {
    MarkdownSerializer,
    defaultMarkdownSerializer,
} from "prosemirror-markdown";
import { APIinterfaceParameter } from "@/extensions/Templates/APIinterface/APIinterfaceComponent";
import { DataSchemaField } from "@/extensions/Templates/DataSchema/DataSchemaComponent";
// Creates a markdown serializer with custom node handling
export const createMarkdownSerializer = (editor: Editor) => {
    // Create custom serializer functions for each node type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type NodeSerializer = (state: any, node: any) => void;
    const nodes: { [key: string]: NodeSerializer } = {
        ...defaultMarkdownSerializer.nodes,
        // Custom serializer for topic node
        topic: (state, node) => {
            const { config } = node.attrs;
            const name = config?.info?.name || "Unknown";
            const description = config?.info?.description || "";

            state.write(`## ${name}\n`);
            state.write(`### Description\n ${description}\n`);
        },
        // Custom serializer for API interface node
        "template-apiInterface": (state, node) => {
            const { config } = node.attrs;
            const info = config?.info || {};
            const fields = config?.fields || [];

            // Write API info header
            state.write(
                `### ${info.method?.toUpperCase() || "METHOD"} ${
                    info.name || "API Name"
                }\n\n`
            );

            // Write endpoint
            state.write(`**Endpoint:** \`${info.endPoint || ""}\`\n\n`);

            // Write description
            if (info.description) {
                state.write(`${info.description}\n\n`);
            }

            // Write parameters table header
            if (fields && fields.length > 0) {
                // Check if there are non-empty fields
                const hasValidFields = fields.some(
                    (field: APIinterfaceParameter) =>
                        field.name.trim() !== "" ||
                        field.type.trim() !== "" ||
                        field.description.trim() !== ""
                );

                if (hasValidFields) {
                    state.write(`#### Parameters\n\n`);
                    state.write(`| Name | Type | Required | Description |\n`);
                    state.write(`| ---- | ---- | -------- | ----------- |\n`);

                    // Write each field as a table row
                    fields.forEach((field: APIinterfaceParameter) => {
                        // Skip completely empty fields
                        if (
                            field.name.trim() === "" &&
                            field.type.trim() === "" &&
                            field.description.trim() === ""
                        ) {
                            return;
                        }

                        // Escape pipe characters in markdown tables
                        const name = (field.name || "").replace(/\|/g, "\\|");
                        const type = (field.type || "").replace(/\|/g, "\\|");
                        const required = field.required ? "Yes" : "No";
                        const description = (field.description || "")
                            .replace(/\|/g, "\\|")
                            .replace(/\n/g, "<br>");

                        state.write(
                            `| ${name} | ${type} | ${required} | ${description} |\n`
                        );
                    });

                    state.write(`\n`);
                }
            }

            // Add a separator
            state.write(`---\n\n`);
        },
        "template-dataSchema": (state, node) => {
            const { config } = node.attrs;
            const info = config?.info || {};
            const fields = config?.fields || [];

            // Write schema info header
            state.write(`### ${info.name || "Data Schema"}`);

            // Add type as a label if present
            if (info.type) {
                state.write(` *${info.type}*`);
            }

            state.write(`\n\n`);

            // Write description
            if (info.description) {
                state.write(`${info.description}\n\n`);
            }

            // Write fields table
            if (fields && fields.length > 0) {
                // Check if there are non-empty fields
                const hasValidFields = fields.some(
                    (field: DataSchemaField) =>
                        field.name.trim() !== "" ||
                        field.type.trim() !== "" ||
                        field.description.trim() !== ""
                );

                if (hasValidFields) {
                    state.write(`#### Fields\n\n`);
                    state.write(`| Field | Type | Description |\n`);
                    state.write(`| ----- | ---- | ----------- |\n`);

                    // Write each field as a table row
                    fields.forEach((field: DataSchemaField) => {
                        // Skip completely empty fields
                        if (
                            field.name.trim() === "" &&
                            field.type.trim() === "" &&
                            field.description.trim() === ""
                        ) {
                            return;
                        }

                        // Escape pipe characters in markdown tables
                        const name = (field.name || "").replace(/\|/g, "\\|");
                        const type = (field.type || "").replace(/\|/g, "\\|");
                        const description = (field.description || "")
                            .replace(/\|/g, "\\|")
                            .replace(/\n/g, "<br>");

                        state.write(`| ${name} | ${type} | ${description} |\n`);
                    });

                    state.write(`\n`);
                }
            }

            // Add a separator
            state.write(`---\n\n`);
        },

        "template-mermaid": (state, node) => {
            const { config } = node.attrs;
            const name = config?.info?.name || "Mermaid Diagram";
            const mermaidCode = config?.content || "";

            // Write diagram name as a heading
            state.write(`### ${name}\n\n`);

            // Write mermaid code in a fenced code block
            state.write("```mermaid\n");
            state.write(`${mermaidCode}\n`);
            state.write("```\n\n");

            // Add a separator
            state.write(`---\n\n`);
        },
    };

    // Add fallback serializers for any node types not handled
    Object.keys(editor.schema.nodes).forEach((nodeName) => {
        if (!nodes[nodeName]) {
            nodes[nodeName] = (state, node) => {
                // Default fallback just renders content
                if (node.content) {
                    state.renderContent(node);
                }
            };
        }
    });

    // Create serializer with our custom nodes and default marks
    return new MarkdownSerializer(nodes, defaultMarkdownSerializer.marks);
};

// Convert editor content to markdown
export const getMarkdown = (editor: Editor): string => {
    if (!editor) return "";
    const serializer = createMarkdownSerializer(editor);
    return serializer.serialize(editor.state.doc);
};

// Download markdown as a file
export const downloadMarkdown = (
    markdown: string,
    filename = "document.md"
) => {
    const blob = new Blob([markdown], {
        type: "text/markdown;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

// Copy markdown to clipboard
export const copyMarkdownToClipboard = async (
    markdown: string
): Promise<void> => {
    await navigator.clipboard.writeText(markdown);
};
