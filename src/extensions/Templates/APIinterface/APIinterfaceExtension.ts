import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import APIinterfaceComponent from "./APIinterfaceComponent";
import { v4 as uuidv4 } from "uuid";
import {
    createConfigAttribute,
    createPasteHandlerPlugin,
    createNodeTransformer,
} from "../../ExtensionUtils";

const topicDefaultConfig = {
    name: "API name",
    method: "GET",
    description: "This is a api interface description",
    endPoint: "/api/v1/demo",
    fields: [
        {
            name: "id",
            type: "string",
            required: true,
            description: "Unique identifier for the resource",
        },
    ],
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
                console.debug(
                    "Processing topic node during paste:",
                    transformedNode.attrs.config
                );
                return transformedNode;
            }),
        ];
    },
});
