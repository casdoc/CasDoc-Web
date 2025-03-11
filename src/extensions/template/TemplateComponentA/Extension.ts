import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { Component } from "./Component";

export const TemplateComponentA = Node.create({
    name: "templateComponentA",

    group: "block",

    atom: true,

    addAttributes() {
        return {
            parent: {
                default: "",
            },
            content: {
                default: "系統架構",
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: "TemplateComponentA",
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ["TemplateComponentA", mergeAttributes(HTMLAttributes)];
    },

    addNodeView() {
        return ReactNodeViewRenderer(Component);
    },
});
