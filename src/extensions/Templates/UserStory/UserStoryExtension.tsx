import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import DataSchemaComponent from "./UserStoryComponent";
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
            name: "User Login",
            serial: "story-01",
            priority: "2",
            tag: "login",
        },
        fields: [
            {
                role: "As a registered user, I would like to log in to the system.",
                feature:
                    "Log in by entering your username and password to access my personal information and services.",
                acceptance: [
                    "The user can successfully log in after entering the correct account and password",
                    "When you enter an incorrect password, a 'Wrong account or password' message will be displayed",
                    "After entering the wrong password 5 times in a row, the account is locked.",
                ],
            },
        ],
    },
};

export const UserStoryExtension = Node.create({
    name: "template-userStory",

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
                tag: "user-story",
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ["user-story", mergeAttributes(HTMLAttributes)];
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
            createPasteHandlerPlugin("template-userStory", (node) => {
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
