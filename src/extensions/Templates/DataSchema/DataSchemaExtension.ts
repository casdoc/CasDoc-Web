import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import DataSchemaComponent from "./DataSchemaComponent";
import { v4 as uuidv4 } from "uuid";

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
                tag: "data-schema",
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ["data-schema", mergeAttributes(HTMLAttributes)];
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
        return ReactNodeViewRenderer(DataSchemaComponent);
    },
});
