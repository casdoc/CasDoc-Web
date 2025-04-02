import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import TestCaseComponent from "./TestCaseComponent";
import { v4 as uuidv4 } from "uuid";
import {
    createConfigAttribute,
    createPasteHandlerPlugin,
    createNodeTransformer,
} from "../../ExtensionUtils";

import { NodeSelection } from "@tiptap/pm/state";

const topicDefaultConfig = {
    config: {
        info: {
            name: "Test Login Functionality",
            serial: "test-01",
            description: "Ensure user can log in with correct credentials",
            expectedResult:
                "User is successfully redirected to dashboard after login",
        },
        fields: [
            {
                step: "Enter valid username and password",
                done: false,
            },
        ],
    },
};

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

    addKeyboardShortcuts() {
        return {
            "Mod-Enter": () => {
                const { state } = this.editor;
                const { selection } = state;

                if (
                    selection instanceof NodeSelection &&
                    selection.node.attrs.id
                ) {
                    console.debug("Selected node id:", selection.node.attrs.id);
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
