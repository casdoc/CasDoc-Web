import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import DataSchemaComponent, { DataSchemaField } from "./DataSchemaComponent";
import { v4 as uuidv4 } from "uuid";
import {
    createConfigAttribute,
    createPasteHandlerPlugin,
    createNodeTransformer,
} from "../../ExtensionUtils";
import { NodeSelection } from "@tiptap/pm/state";
const topicDefaultConfig = {
    info: {
        name: "Schema",
        type: "Object",
        description: "This is a data schema description",
    },
    fields: [
        {
            name: "field",
            type: "default",
            description: "default field",
        },
    ],
    fieldKey: "description",
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const serializeDataSchemaToMarkdown = (state: any, node: any) => {
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
};
export const DataSchemaExtension = Node.create({
    name: "template-dataSchema",

    group: "block",

    atom: false,
    isolating: true,
    selectable: true,

    addAttributes() {
        return {
            topicId: {
                default: "test-topic-1",
            },
            id: {
                default: uuidv4(),
            },

            config: createConfigAttribute(topicDefaultConfig),
        };
    },

    parseHTML() {
        return [
            {
                tag: "data-schema",
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ["data-schema", mergeAttributes(HTMLAttributes)];
    },

    addKeyboardShortcuts() {
        return {
            "Mod-Enter": () => {
                // Handle node selection directly instead of using the command
                const { state } = this.editor;
                const { selection } = state;

                // Import needed at the top of the file
                if (
                    selection instanceof NodeSelection &&
                    selection.node.attrs.id
                ) {
                    console.debug("Selected node id:", selection.node.attrs.id);
                    // Dispatch custom event that useBlockEditor can listen for
                    const event = new CustomEvent("node-selection", {
                        detail: { id: selection.node.attrs.id },
                    });
                    window.dispatchEvent(event);
                }
                return true;
            },
        };
    },

    addNodeView() {
        return ReactNodeViewRenderer(DataSchemaComponent);
    },
    addProseMirrorPlugins() {
        const pasteDefaultConfig = topicDefaultConfig;
        // Use the generic node transformer with your specific config
        const topicTransformer = createNodeTransformer(pasteDefaultConfig);

        // Use the reusable paste handler plugin
        return [
            createPasteHandlerPlugin("template-dataSchema", (node) => {
                const transformedNode = topicTransformer(node);
                // console.debug(
                //     "Processing topic node during paste:",
                //     transformedNode.attrs.config
                // );
                return transformedNode;
            }),
        ];
    },
});
