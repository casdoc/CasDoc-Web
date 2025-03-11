import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { DataSchemaComponent } from "./DataSchemaComponent";

export const DataSchemaExtension = Node.create({
    name: "template-dataSchema",

    group: "block",

    atom: true,

    addAttributes() {
        return {
            name: {
                default: "",
            },
            type: {
                default: "",
            },
            description: {
                default: "",
            },
            // fields 為一個陣列，每個元素包含 name, type 與 description
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
