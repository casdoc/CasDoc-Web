import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import TestCaseComponent from "./TestCaseComponent";
import { v4 as uuidv4 } from "uuid";
import {
    createConfigAttribute,
    createPasteHandlerPlugin,
    createNodeTransformer,
    setupNodeEventHandlers,
    cleanupNodeEventHandlers,
} from "../../ExtensionUtils";
import { TestCaseEntity } from "./entity/TestCaseEntity";

const topicDefaultConfig = TestCaseEntity.getDefaultConfig();

export const serializeTestCaseToMarkdown = TestCaseEntity.serializeToMarkdown;

export const TestCaseExtension = Node.create({
    name: "template-testCase",

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
                tag: "test-case",
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ["test-case", mergeAttributes(HTMLAttributes)];
    },

    onCreate() {
        setupNodeEventHandlers(this.editor, this.name, this.storage);
    },

    onDestroy() {
        cleanupNodeEventHandlers(this.storage);
    },

    addNodeView() {
        return ReactNodeViewRenderer(TestCaseComponent);
    },

    addProseMirrorPlugins() {
        const pasteDefaultConfig = topicDefaultConfig;
        const topicTransformer = createNodeTransformer(pasteDefaultConfig);

        return [
            createPasteHandlerPlugin("template-testCase", (node) => {
                const transformedNode = topicTransformer(node);
                return transformedNode;
            }),
        ];
    },
});
