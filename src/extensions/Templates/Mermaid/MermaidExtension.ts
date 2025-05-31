import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { v4 as uuidv4 } from "uuid";
import {
    createConfigAttribute,
    createPasteHandlerPlugin,
    createNodeTransformer,
    setupNodeEventHandlers,
    cleanupNodeEventHandlers,
} from "../../ExtensionUtils";
import MermaidComponent from "./MermaidComponent";
import { MermaidEntity } from "./entity/MermaidEntity";

export const mermaidDefaultConfig = MermaidEntity.getDefaultConfig();

export const serializeMermaidToMarkdown = MermaidEntity.serializeToMarkdown;

export const MermaidExtension = Node.create({
    name: "template-mermaid",

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
            config: createConfigAttribute(mermaidDefaultConfig),
        };
    },

    parseHTML() {
        return [
            {
                tag: "mermaid",
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ["mermaid", mergeAttributes(HTMLAttributes)];
    },

    addNodeView() {
        return ReactNodeViewRenderer(MermaidComponent);
    },
    onCreate() {
        setupNodeEventHandlers(this.editor, this.name, this.storage);
    },

    onDestroy() {
        cleanupNodeEventHandlers(this.storage);
    },
    addProseMirrorPlugins() {
        const pasteDefaultConfig = mermaidDefaultConfig;
        // Use the generic node transformer with your specific config
        const topicTransformer = createNodeTransformer(pasteDefaultConfig);

        // Use the reusable paste handler plugin
        return [
            createPasteHandlerPlugin("template-mermaid", (node) => {
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
