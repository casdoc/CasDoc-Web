import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import TopicComponent from "./TopicComponent";

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
                default: "test-topic-1",
            },
            config: {
                default: {},
            },
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

    addKeyboardShortcuts() {
        return {
            "Mod-Enter": () => {
                const { selection } = this.editor.state;
                this.editor.commands.toggleContextValue();
                if (selection.node && selection.node.type.name === this.name) {
                    return true;
                }
                return false;
            },
        };
    },

    addNodeView() {
        return ReactNodeViewRenderer(TopicComponent, {
            as: "div",
            className: "topic-node-wrapper",
        });
    },
});
