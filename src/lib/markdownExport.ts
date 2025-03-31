import { Editor } from "@tiptap/react";
import {
    MarkdownSerializer,
    defaultMarkdownSerializer,
} from "prosemirror-markdown";

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

            state.write(`:::topic\n`);
            state.write(`Name: ${name}\n`);
            state.write(`Description: ${description}\n`);
            state.write(`:::\n\n`);
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
