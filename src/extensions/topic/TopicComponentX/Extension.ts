import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { Component } from "./Component";

export const TopicComponentX = Node.create({
    name: "topicComponentX",

    group: "block",

    atom: true,
    draggable: true,

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
                tag: "TopicComponentX",
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ["TopicComponentX", mergeAttributes(HTMLAttributes)];
    },

    addNodeView() {
        return ReactNodeViewRenderer(Component);
    },
});
