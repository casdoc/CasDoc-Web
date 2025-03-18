import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import APIinterfaceComponent from "./APIinterfaceComponent";
import { v4 as uuidv4 } from "uuid";

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
            config: {
                default: {
                    name: "",
                },
            },
            fields: {
                default: [],
            },
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
        return ReactNodeViewRenderer(APIinterfaceComponent);
    },
});
