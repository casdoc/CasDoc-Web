import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { Component } from "./Component";

export const TemplateComponentB = Node.create({
    name: "templateComponentB",

    group: "block",

    atom: true,

    addAttributes() {
        return {
            count: {
                default: 0,
            },
            parent: {
                default: "",
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: "TemplateComponentB",
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ["TemplateComponentB", mergeAttributes(HTMLAttributes)];
    },

    addNodeView() {
        return ReactNodeViewRenderer(Component);
    },
});
