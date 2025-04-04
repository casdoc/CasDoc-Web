import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Slice, Fragment, Node as PMNode } from "@tiptap/pm/model";
import { v4 as uuidv4 } from "uuid";
import { Editor } from "@tiptap/core";

/**
 * Creates a reusable config attribute definition for extensions
 * @param defaultConfig Default configuration object with custom fields
 * @returns Config attribute definition for use in addAttributes
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createConfigAttribute(defaultConfig: any) {
    return {
        default: defaultConfig,
        parseHTML: (element: HTMLElement) => {
            const configAttr = element.getAttribute("data-config");
            if (!configAttr) {
                return defaultConfig;
            }

            try {
                return JSON.parse(configAttr);
            } catch (e) {
                console.error("Failed to parse config attribute", e);
                return defaultConfig;
            }
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        renderHTML: (attributes: any) => {
            try {
                if (attributes.config) {
                    return {
                        "data-config": JSON.stringify(attributes.config),
                    };
                }
                return {};
            } catch (e) {
                console.error("Failed to stringify config", e);
                return {};
            }
        },
    };
}

/**
 * Callback function that transforms a node
 */
export interface NodeTransformer {
    (node: PMNode): PMNode;
}

/**
 * Maps over a Fragment and applies a transformation to each node
 * @param fragment The fragment to transform
 * @param callback Function to apply to each node
 * @returns A new transformed fragment
 */
export function mapFragment(
    fragment: Fragment,
    callback: NodeTransformer
): Fragment {
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

/**
 * Creates a paste handler plugin that handles node transformation during paste
 * @param nodeName Name of the node type to transform
 * @param transformNode Function to transform the node during paste
 * @returns Plugin for handling paste transformations
 */
export function createPasteHandlerPlugin(
    nodeName: string,
    transformNode: (node: PMNode) => PMNode
) {
    return new Plugin({
        key: new PluginKey(`${nodeName}HandlePaste`),
        props: {
            transformPasted: (slice) => {
                let hasTargetNode = false;
                slice.content.descendants((node) => {
                    if (node.type.name === nodeName) {
                        hasTargetNode = true;
                        return false;
                    }
                    return true;
                });

                if (!hasTargetNode) {
                    return slice;
                }

                const newContent = mapFragment(slice.content, (node) => {
                    if (node.type.name === nodeName) {
                        return transformNode(node);
                    }
                    return node;
                });

                return new Slice(newContent, slice.openStart, slice.openEnd);
            },
        },
    });
}

/**
 * Creates a standard node transformation function that generates a new ID and handles config
 * @param defaultConfig Default config to use if parsing fails (any structure)
 * @returns Node transformer function for use with mapFragment
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createNodeTransformer(defaultConfig: any) {
    return (node: PMNode) => {
        // Handle config properly during paste
        let config = { ...node.attrs.config };

        if (typeof node.attrs.config === "string") {
            try {
                config = JSON.parse(node.attrs.config);
            } catch (e) {
                console.error("Failed to parse config during paste", e);
                config = defaultConfig;
            }
        }

        return node.type.create(
            {
                ...node.attrs,
                id: uuidv4(),
                config: config,
            },
            node.content
        );
    };
}

/**
 * Sets up common event listeners for node operations
 * @param editor Tiptap editor instance
 * @param extensionName Name of the extension these handlers are for
 * @param storageRef A reference to the extension's storage to track initialization
 */
export const setupNodeEventHandlers = (
    editor: Editor,
    extensionName: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    storageRef: Record<string, any>
) => {
    if (storageRef.hasInitializedListeners) {
        return;
    }
    // Handle node delete event
    const handleNodeDelete = (event: Event) => {
        if (storageRef.isDeleting) return;
        const customEvent = event as CustomEvent;
        const { pos, id } = customEvent.detail;
        const node = editor.state.doc.nodeAt(pos);
        if (!node || node.attrs.id !== id) {
            return;
        }
        editor.chain().setNodeSelection(pos).deleteSelection().run();
    };

    // Handle node copy event
    const handleNodeCopy = (event: Event) => {
        const customEvent = event as CustomEvent;
        const { pos } = customEvent.detail;

        // Find the node by position
        const node = editor.state.doc.nodeAt(pos);
        if (node && node.type.name === extensionName) {
            // Create a duplicate node with new ID
            const newNode = node.type.create(
                {
                    ...node.attrs,
                    id: uuidv4(), // Generate a new ID
                },
                node.content
            );

            // Insert after the current node
            editor.commands.insertContentAt(pos + node.nodeSize, newNode);
        }
    };
    // Set up the event listeners
    window.addEventListener("node-copy", handleNodeCopy);
    window.addEventListener("node-delete", handleNodeDelete);

    // Store the handlers so they can be removed if needed
    storageRef.eventHandlers = {
        copy: handleNodeCopy,
        delete: handleNodeDelete,
    };

    storageRef.hasInitializedListeners = true;
};

/**
 * Removes event listeners that were set up by setupNodeEventHandlers
 * @param storageRef A reference to the extension's storage
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cleanupNodeEventHandlers(storageRef: Record<string, any>) {
    if (storageRef.eventHandlers) {
        window.removeEventListener("node-copy", storageRef.eventHandlers.copy);
        window.removeEventListener(
            "node-delete",
            storageRef.eventHandlers.delete
        );

        storageRef.eventHandlers = null;
    }
}
