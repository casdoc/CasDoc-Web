import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import WhiteBoardComponent from "./WhiteBoardComponent";
import { v4 as uuidv4 } from "uuid";
import {
    createConfigAttribute,
    createPasteHandlerPlugin,
    createNodeTransformer,
    setupNodeEventHandlers,
    cleanupNodeEventHandlers,
} from "../../ExtensionUtils";

const whiteBoardDefaultConfig = {
    config: {
        info: {
            name: "System Overview",
            description: "A whiteboard for planning and notes.",
        },
    },
};

export const WhiteBoardExtension = Node.create({
    name: "template-whiteBoard",

    group: "block",
    atom: false,
    isolating: true,
    selectable: true,

    addAttributes() {
        return {
            id: {
                default: uuidv4(),
            },
            config: createConfigAttribute(whiteBoardDefaultConfig),
        };
    },

    parseHTML() {
        return [{ tag: "white-board" }];
    },

    renderHTML({ HTMLAttributes }) {
        return ["white-board", mergeAttributes(HTMLAttributes)];
    },

    onCreate() {
        setupNodeEventHandlers(this.editor, this.name, this.storage);
    },

    onDestroy() {
        cleanupNodeEventHandlers(this.storage);
    },

    addNodeView() {
        return ReactNodeViewRenderer(WhiteBoardComponent);
    },

    addProseMirrorPlugins() {
        const transformer = createNodeTransformer(whiteBoardDefaultConfig);
        return [
            createPasteHandlerPlugin("template-whiteBoard", (node) => {
                return transformer(node);
            }),
        ];
    },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const serializeWhiteBoardToMarkdown = (state: any, node: any) => {
    const { config } = node.attrs;
    const info = config?.info || {};

    state.write(`### ${info.title || "Whiteboard"}\n`);

    if (info.description) {
        state.write(`- **Description** : ${info.description}\n`);
    }

    state.write(`---\n\n`);
};
