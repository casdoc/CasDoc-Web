import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import TopicComponent from "./TopicComponent";
import {
    createConfigAttribute,
    createPasteHandlerPlugin,
    createNodeTransformer,
    setupNodeEventHandlers,
    cleanupNodeEventHandlers,
} from "../ExtensionUtils";

const topicDefaultConfig = {
    name: "Topic",
    description: "This is a topic description",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const serializeTopicToMarkdown = (state: any, node: any) => {
    const { config } = node.attrs;
    const name = config?.info?.name || "Unknown";
    const description = config?.info?.description || "";

    state.write(`## ${name}\n`);
    state.write(`${description}\n`);
};

export const TopicExtension = Node.create({
    name: "topic",

    group: "block",

    atom: false,
    selectable: true,
    isolating: true,
    addAttributes() {
        return {
            documentId: {
                default: "default-document",
            },
            id: {
                default: "topic",
            },
            // Update the renderHTML function in your config attribute
            config: createConfigAttribute(topicDefaultConfig),
            level: "1",
        };
    },

    parseHTML() {
        return [
            {
                tag: "topic",
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ["topic", mergeAttributes(HTMLAttributes)];
    },

    addNodeView() {
        return ReactNodeViewRenderer(TopicComponent);
    },

    onCreate() {
        setupNodeEventHandlers(this.editor, this.name, this.storage);
    },

    onDestroy() {
        cleanupNodeEventHandlers(this.storage);
    },

    addProseMirrorPlugins() {
        const pasteDefaultConfig = {
            name: "Topic",
            description: "This is a topic description",
        };
        // Use the generic node transformer with your specific config
        const topicTransformer = createNodeTransformer(pasteDefaultConfig);

        // Use the reusable paste handler plugin
        return [
            createPasteHandlerPlugin("topic", (node) => {
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
