import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";

import { TraceComponent } from "./TraceComponent";

export default Node.create({
    name: "TraceComponent",

    group: "block",

    content: "inline*",

    parseHTML() {
        return [
            {
                tag: "TraceComponent",
            },
        ];
    },

    addKeyboardShortcuts() {
        return {
            "Mod-Enter": () => {
                return this.editor
                    .chain()
                    .insertContentAt(this.editor.state.selection.head, {
                        type: this.type.name,
                    })
                    .focus()
                    .run();
            },
        };
    },

    renderHTML({ HTMLAttributes }) {
        return ["TraceComponent", mergeAttributes(HTMLAttributes), 0];
    },

    addNodeView() {
        return ReactNodeViewRenderer(TraceComponent);
    },
});
