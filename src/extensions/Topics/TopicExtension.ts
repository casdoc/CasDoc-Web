import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import TopicComponent from "./TopicComponent";
import {
    createConfigAttribute,
    createPasteHandlerPlugin,
    createNodeTransformer,
} from "../ExtensionUtils";
import { NodeSelection } from "@tiptap/pm/state";
import { v4 as uuidv4 } from "uuid";

const topicDefaultConfig = {
    name: "Data Schema",
    description: "This is a data schema description",
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const serializeTopicToMarkdown = (state: any, node: any) => {
    const { config } = node.attrs;
    const name = config?.info?.name || "Unknown";
    const description = config?.info?.description || "";

    state.write(`## ${name}\n`);
    state.write(`${description}\n`);
};
export const TopicExtension = Node.create({
    name: "topic",

    group: "block",

    atom: false,
    selectable: true,
    isolating: true,
    addAttributes() {
        return {
            documentId: {
                default: "default-document",
            },
            id: {
                default: "test-topic-1",
            },
            // Update the renderHTML function in your config attribute
            config: createConfigAttribute(topicDefaultConfig),
        };
    },

    parseHTML() {
        return [
            {
                tag: "topic",
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ["topic", mergeAttributes(HTMLAttributes)];
    },

    addKeyboardShortcuts() {
        return {
            "Mod-Enter": () => {
                // Handle node selection directly instead of using the command
                const { state } = this.editor;
                const { selection } = state;

                // Import needed at the top of the file
                if (
                    selection instanceof NodeSelection &&
                    selection.node.attrs.id
                ) {
                    // Dispatch custom event that useBlockEditor can listen for
                    const event = new CustomEvent("node-selection", {
                        detail: { id: selection.node.attrs.id },
                    });
                    window.dispatchEvent(event);
                }
                return true;
            },
        };
    },

    addNodeView() {
        return ReactNodeViewRenderer(TopicComponent);
    },

    onTransaction({ editor }) {
        // Set up event listeners for node actions when extension is initialized
        if (!this.storage.hasInitializedListeners) {
            // Handle node copy event
            window.addEventListener("node-copy", (event: Event) => {
                const customEvent = event as CustomEvent;
                const { pos } = customEvent.detail;

                // Find the node by position
                const node = editor.state.doc.nodeAt(pos);
                if (node && node.type.name === this.name) {
                    // Create a duplicate node with new ID
                    const newNode = node.type.create(
                        {
                            ...node.attrs,
                            id: uuidv4(), // Generate a new ID
                        },
                        node.content
                    );

                    // Insert after the current node
                    editor.commands.insertContentAt(
                        pos + node.nodeSize,
                        newNode
                    );
                }
            });

            // Handle node delete event
            window.addEventListener("node-delete", (event: Event) => {
                const customEvent = event as CustomEvent;
                const { pos } = customEvent.detail;

                const node = editor.state.doc.nodeAt(pos);
                if (node) {
                    editor.commands.deleteRange({
                        from: pos,
                        to: pos + node.nodeSize,
                    });
                }
            });

            this.storage.hasInitializedListeners = true;
        }
    },

    addProseMirrorPlugins() {
        const pasteDefaultConfig = {
            name: "Schema",
            description: "This is a data schema description",
        };
        // Use the generic node transformer with your specific config
        const topicTransformer = createNodeTransformer(pasteDefaultConfig);

        // Use the reusable paste handler plugin
        return [
            createPasteHandlerPlugin("topic", (node) => {
                const transformedNode = topicTransformer(node);
                console.debug(
                    "Processing topic node during paste:",
                    transformedNode.attrs.config
                );
                return transformedNode;
            }),
        ];
    },
});
