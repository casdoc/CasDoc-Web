import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import APIinterfaceComponent from "./APIinterfaceComponent";
import { v4 as uuidv4 } from "uuid";
import {
    createConfigAttribute,
    createPasteHandlerPlugin,
    createNodeTransformer,
    setupNodeEventHandlers,
    cleanupNodeEventHandlers,
} from "@/extensions/ExtensionUtils";
import {
    APIinterfaceConfig,
    APIinterfaceParameter,
} from "./APIinterfaceComponent";

const apiDefaultConfig: APIinterfaceConfig = {
    info: {
        name: "API name",
        method: "GET",
        description: "This is an API interface description",
        endPoint: "/api/v1/demo",
    },
    headers: [],
    requestBody: [],
    responseBody: [],
    fieldKey: "description",
};

export const serializeAPIinterfaceToMarkdown = (
    state: { write: (content: string) => void },
    node: { attrs: { config: APIinterfaceConfig } }
) => {
    const { config } = node.attrs;
    const { info } = config;

    const writeSection = (title: string, fields: APIinterfaceParameter[]) => {
        if (!fields.length) return;
        state.write(`#### ${title}\n\n`);
        state.write(`| Name | Type | Required | Description |\n`);
        state.write(`| ---- | ---- | -------- | ----------- |\n`);
        fields.forEach((field) => {
            const name = field.name.replace(/\|/g, "\\|");
            const type = field.type.replace(/\|/g, "\\|");
            const required = field.required ? "Yes" : "No";
            const description = field.description
                .replace(/\|/g, "\\|")
                .replace(/\n/g, "<br>");
            state.write(
                `| ${name} | ${type} | ${required} | ${description} |\n`
            );
        });
        state.write(`\n`);
    };

    state.write(`### ${info.method.toUpperCase()} ${info.name}\n\n`);
    state.write(`**Endpoint:** \`${info.endPoint}\`\n\n`);
    if (info.description) state.write(`${info.description}\n\n`);

    writeSection("Headers", config.headers);
    writeSection("Request Body", config.requestBody);
    writeSection("Response Body", config.responseBody);

    state.write("---\n\n");
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
                default: "default-topic",
            },
            id: {
                default: uuidv4(),
            },
            config: createConfigAttribute(apiDefaultConfig),
        };
    },

    parseHTML() {
        return [{ tag: "api-interface" }];
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
        const transformer = createNodeTransformer(apiDefaultConfig);
        return [
            createPasteHandlerPlugin("template-apiInterface", (node) =>
                transformer(node)
            ),
        ];
    },
});
