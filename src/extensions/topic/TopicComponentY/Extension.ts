import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { Component } from "./Component";

export const TopicComponentY = Node.create({
    name: "topicComponentY",

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
                tag: "TopicComponentY",
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ["TopicComponentY", mergeAttributes(HTMLAttributes)];
    },

    addNodeView() {
        return ReactNodeViewRenderer(Component);
    },
});
