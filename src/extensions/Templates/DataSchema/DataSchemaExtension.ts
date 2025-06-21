import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import DataSchemaComponent from "./DataSchemaComponent";
import { v4 as uuidv4 } from "uuid";
import {
    createConfigAttribute,
    createPasteHandlerPlugin,
    createNodeTransformer,
    setupNodeEventHandlers,
    cleanupNodeEventHandlers,
} from "../../ExtensionUtils";
import { DataSchemaEntity } from "@/extensions/Templates/DataSchema/entity/DataSchemaEntity";

const topicDefaultConfig = DataSchemaEntity.getDefaultConfig();

export const serializeDataSchemaToMarkdown =
    DataSchemaEntity.serializeToMarkdown;

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

    onCreate() {
        setupNodeEventHandlers(this.editor, this.name, this.storage);
    },

    onDestroy() {
        cleanupNodeEventHandlers(this.storage);
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
