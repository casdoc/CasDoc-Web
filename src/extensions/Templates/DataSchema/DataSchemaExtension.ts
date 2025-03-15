import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { DataSchemaComponent } from "./DataSchemaComponent";
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
            name: {
                default: "",
            },
            type: {
                default: "",
            },
            description: {
                default: "",
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

    addNodeView() {
        return ReactNodeViewRenderer(DataSchemaComponent);
    },
});
