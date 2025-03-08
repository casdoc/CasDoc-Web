import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { Component } from "./Component";

export const TraceComponent = Node.create({
    name: "traceComponent",

    group: "block",

    atom: true,

    addAttributes() {
        return {
            count: {
                default: 0,
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: "TraceComponent",
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ["TraceComponent", mergeAttributes(HTMLAttributes)];
    },

    addNodeView() {
        return ReactNodeViewRenderer(Component);
    },
});
