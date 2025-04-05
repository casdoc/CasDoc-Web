import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import APIinterfaceComponent, {
    APIinterfaceParameter,
} from "./APIinterfaceComponent";
import { v4 as uuidv4 } from "uuid";
import {
    createConfigAttribute,
    createPasteHandlerPlugin,
    createNodeTransformer,
    setupNodeEventHandlers,
    cleanupNodeEventHandlers,
} from "../../ExtensionUtils";

const topicDefaultConfig = {
    info: {
        name: "API name",
        method: "GET",
        description: "This is a api interface description",
        endPoint: "/api/v1/demo",
    },
    fields: [
        {
            name: "id",
            type: "string",
            required: true,
            description: "Unique identifier for the resource",
        },
    ],
    fieldKey: "description",
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const serializeAPIinterfaceToMarkdown = (state: any, node: any) => {
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
};
export const APIinterfaceExtension = Node.create({
    name: "template-apiInterface",

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
                tag: "api-interface",
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ["api-interface", mergeAttributes(HTMLAttributes)];
    },

    onCreate() {
        setupNodeEventHandlers(this.editor, this.name, this.storage);
    },

    onDestroy() {
        cleanupNodeEventHandlers(this.storage);
    },

    addNodeView() {
        return ReactNodeViewRenderer(APIinterfaceComponent);
    },

    addProseMirrorPlugins() {
        const pasteDefaultConfig = topicDefaultConfig;
        // Use the generic node transformer with your specific config
        const topicTransformer = createNodeTransformer(pasteDefaultConfig);

        // Use the reusable paste handler plugin
        return [
            createPasteHandlerPlugin("template-apiInterface", (node) => {
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
