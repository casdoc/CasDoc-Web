import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { Component } from "./Component";

export const TemplateComponentC = Node.create({
    name: "templateComponentC",

    group: "block",

    atom: true,

    addAttributes() {
        return {
            parent: {
                default: "",
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: "TemplateComponentC",
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ["TemplateComponentC", mergeAttributes(HTMLAttributes)];
    },

    addNodeView() {
        return ReactNodeViewRenderer(Component);
    },
});
