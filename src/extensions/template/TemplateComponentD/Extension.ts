import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { Component } from "./Component";

export const TemplateComponentD = Node.create({
    name: "templateComponentD",

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
                tag: "TemplateComponentD",
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ["TemplateComponentD", mergeAttributes(HTMLAttributes)];
    },

    addNodeView() {
        return ReactNodeViewRenderer(Component);
    },
});
