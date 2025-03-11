import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { Component } from "./Component";

export const TemplateComponentB = Node.create({
    name: "templateComponentB",

    group: "block",

    atom: true,

    addAttributes() {
        return {
            parent: {
                default: "",
            },
            content: {
                default: "系統需求",
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
