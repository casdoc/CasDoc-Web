import {
    Extension,
    findChildren,
    findChildrenInRange,
    getChangedRanges,
    combineTransactionSteps,
    Editor,
    Range,
} from "@tiptap/core";
import { Node as ProseMirrorNode, Slice, Fragment } from "@tiptap/pm/model";
import { Plugin, PluginKey, Transaction, EditorState } from "@tiptap/pm/state";
import { v4 as uuidv4 } from "uuid";
import { EditorView } from "@tiptap/pm/view";
import z from "zod";

export interface UniqueIDOptions {
    /**
     * The attribute name to use for the unique ID.
     * @default 'id'
     */
    attributeName: string;
    /**
     * An array of node types that should have unique IDs.
     * @default []
     */
    types: string[];
    /**
     * A function that generates a unique ID.
     * @default () => uuidv4()
     */
    generateID: () => string;
    /**
     * A function that filters transactions. Return true to skip ID generation.
     * @default null
     */
    filterTransaction: ((transaction: Transaction) => boolean) | null;
}

export const UniqueID = Extension.create<UniqueIDOptions>({
    name: "uniqueID",

    priority: 10000, // Needs to run before Collaboration Cursor

    addOptions() {
        return {
            attributeName: "id",
            types: [],
            generateID: () => uuidv4(),
            filterTransaction: null,
        };
    },

    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    [this.options.attributeName]: {
                        default: null,
                        parseHTML: (element) =>
                            element.getAttribute(
                                `data-${this.options.attributeName}`
                            ),
                        renderHTML: (attributes) => {
                            if (!attributes[this.options.attributeName]) {
                                return {};
                            }

                            return {
                                [`data-${this.options.attributeName}`]:
                                    attributes[this.options.attributeName],
                            };
                        },
                        keepOnSplit: false, // Don't keep ID on split
                    },
                },
            },
        ];
    },

    // Runs on editor creation. Assigns IDs to existing nodes if they don't have one.
    onCreate() {
        const { view, state } = this.editor;
        const { tr, doc } = state;
        const { types, attributeName, generateID } = this.options;
        const uuidSchema = z.uuid();
        // Find nodes of specified types that are missing the ID attribute
        const tmp = findChildren(
            doc,
            (node) =>
                types.includes(node.type.name) &&
                node.attrs[attributeName] === null
            // !uuidSchema.safeParse(node.attrs[attributeName]).success)
        );

        findChildren(
            doc,
            (node) =>
                types.includes(node.type.name) &&
                (node.attrs[attributeName] === null ||
                    !uuidSchema.safeParse(node.attrs[attributeName]).success)
        ).forEach(({ node, pos }) => {
            tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                [attributeName]: generateID(),
            });
        });

        // Don't add this transaction to the history
        tr.setMeta("addToHistory", false);
        view.dispatch(tr);
    },

    addProseMirrorPlugins() {
        let dragSourceElement: HTMLElement | null = null;
        let pastedOrDropped = false;

        return [
            new Plugin({
                key: new PluginKey("uniqueID"),

                // Append transaction to assign IDs to new nodes
                appendTransaction: (transactions, oldState, newState) => {
                    const docChanged =
                        transactions.some(
                            (transaction) => transaction.docChanged
                        ) && !oldState.doc.eq(newState.doc);
                    const filterTransactions =
                        this.options.filterTransaction &&
                        transactions.some((tr) =>
                            this.options.filterTransaction?.(tr)
                        );

                    if (!docChanged || filterTransactions) {
                        return;
                    }

                    const { tr } = newState;
                    const { types, attributeName, generateID } = this.options;

                    // Combine transactions steps to get final mapping
                    const transform = combineTransactionSteps(
                        oldState.doc,
                        Array.from(transactions)
                    );
                    const { mapping } = transform;

                    // Get ranges affected by the transactions
                    getChangedRanges(transform).forEach(({ newRange }) => {
                        // Find nodes within the changed ranges
                        const nodes = findChildrenInRange(
                            newState.doc,
                            newRange,
                            (node) => types.includes(node.type.name)
                        );
                        // const uuidSchema = z.uuid();
                        nodes.forEach(({ node, pos }) => {
                            // Check if the node already exists in the new state doc at the mapped position
                            // const mappedPos = mapping.map(pos);
                            // const nodeExist =
                            //     newState.doc.nodeAt(mappedPos)?.type.name ===
                            //     node.type.name;

                            // Check if the node at the current position in the transaction doc has an ID
                            const id = tr.doc.nodeAt(pos)?.attrs[attributeName];

                            // Assign an ID if the node is new (doesn't exist at mapped pos) or lacks an ID
                            if (id === null) {
                                tr.setNodeMarkup(pos, undefined, {
                                    ...node.attrs,
                                    [attributeName]: generateID(),
                                });
                            }
                        });
                    });

                    if (!tr.steps.length) {
                        return;
                    }

                    return tr;
                },

                // Handle view updates, specifically for drag and drop
                view(view) {
                    const handleDragStart = (event: DragEvent) => {
                        // Check if the drag started within the editor's DOM
                        dragSourceElement =
                            (event.target as HTMLElement)?.closest(
                                ".ProseMirror"
                            ) === view.dom
                                ? view.dom
                                : null;
                    };

                    window.addEventListener("dragstart", handleDragStart);

                    return {
                        destroy() {
                            window.removeEventListener(
                                "dragstart",
                                handleDragStart
                            );
                        },
                    };
                },

                // Handle paste and drop events to reset IDs on pasted/dropped content
                props: {
                    handleDOMEvents: {
                        // Set flag if content is dropped within the same editor instance
                        drop: (view, event: DragEvent) => {
                            if (dragSourceElement === view.dom) {
                                pastedOrDropped = true;
                            }
                            return false; // Let ProseMirror handle the drop
                        },
                        // Set flag on paste
                        paste: () => {
                            pastedOrDropped = true;
                            return false; // Let ProseMirror handle the paste
                        },
                    },

                    // Transform pasted content to remove existing IDs
                    transformPasted: (slice: Slice) => {
                        // Only transform if the content was pasted or dropped from the same editor
                        if (!pastedOrDropped) {
                            return slice;
                        }

                        const { types, attributeName } = this.options;

                        // Recursive function to traverse the slice content
                        const transformNodes = (
                            nodes: ProseMirrorNode[]
                        ): ProseMirrorNode[] => {
                            return nodes.map((node) => {
                                if (node.isText) {
                                    return node; // Keep text nodes as is
                                }

                                // If the node type is not in the specified types, recurse into its content
                                if (!types.includes(node.type.name)) {
                                    return node.copy(
                                        Fragment.from(
                                            transformNodes(
                                                Array.from(
                                                    slice.content as unknown as ProseMirrorNode[]
                                                )
                                            )
                                        )
                                    );
                                }

                                // If the node type should have an ID, create a new node with ID set to null
                                return node.type.create(
                                    {
                                        ...node.attrs,
                                        [attributeName]: null, // Reset ID
                                    },
                                    Fragment.from(
                                        transformNodes(
                                            Array.from(
                                                slice.content as unknown as ProseMirrorNode[]
                                            )
                                        )
                                    ), // Recurse into content
                                    node.marks
                                );
                            });
                        };

                        // Reset the flag
                        pastedOrDropped = false;

                        // Create a new slice with transformed content
                        return new Slice(
                            Fragment.from(
                                transformNodes(
                                    Array.from(
                                        slice.content as unknown as ProseMirrorNode[]
                                    )
                                )
                            ),
                            slice.openStart,
                            slice.openEnd
                        );
                    },
                },
            }),
        ];
    },
});

export default UniqueID;
