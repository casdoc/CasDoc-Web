import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { TopicComponent } from "./TopicComponent";
import { PluginKey, Plugin } from "@tiptap/pm/state";
import { v4 as uuidv4 } from "uuid";
import { Slice, Fragment, Node as PMNode } from "@tiptap/pm/model";
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
            name: {
                default: "",
            },
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

    addNodeView() {
        return ReactNodeViewRenderer(TopicComponent);
    },
    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: new PluginKey("topicHandlePaste"),
                props: {
                    transformPasted: (slice) => {
                        let hasTopicNode = false;
                        slice.content.descendants((node) => {
                            if (node.type.name === "topic") {
                                hasTopicNode = true;
                                return false;
                            }
                            return true;
                        });

                        if (!hasTopicNode) {
                            return slice;
                        }
                        // for each topic node, generate a new UUID
                        const newContent = mapFragment(
                            slice.content,
                            (node) => {
                                if (node.type.name === "topic") {
                                    return node.type.create(
                                        {
                                            ...node.attrs,
                                            id: uuidv4(),
                                        },
                                        node.content
                                    );
                                }
                                return node;
                            }
                        );

                        return new Slice(
                            newContent,
                            slice.openStart,
                            slice.openEnd
                        );
                    },
                },
            }),
        ];
    },
});
/**
 * Callback function that transforms a node
 */
interface NodeTransformer {
    (node: PMNode): PMNode;
}

/**
 * Maps over a Fragment and applies a transformation to each node
 * @param fragment The fragment to transform
 * @param callback Function to apply to each node
 * @returns A new transformed fragment
 */
function mapFragment(fragment: Fragment, callback: NodeTransformer): Fragment {
    const result: PMNode[] = [];
    fragment.forEach((node: PMNode) => {
        //map over the node
        const mapped = callback(node);
        //if the node has content, recursively map over it
        if (mapped.content.size) {
            const newContent = mapFragment(mapped.content, callback);
            result.push(mapped.copy(newContent));
        } else {
            result.push(mapped);
        }
    });
    return Fragment.from(result);
}
