import ExtensionKit from "@/extensions/ExtensionKit";
import { Editor, useEditor } from "@tiptap/react";
import { Document } from "@/app/models/entity/Document";
import { useCallback, useEffect, useRef } from "react";
import { NodeSelection } from "@tiptap/pm/state";
import { useDocumentContentQueries } from "./hooks/useDocumentContentQueries";
import { debounce } from "lodash";
import { Node as ProsemirrorNode } from "prosemirror-model";
import { v4 as uuidv4 } from "uuid";
import { Delete } from "lucide-react";
import { useDeleteBlockMutation } from "./hooks/useDeleteBlockMutation";
import { useCreateBlockMutation } from "./hooks/useCreateBlockMutation";
import { useUpdateBlockMutation } from "./hooks/useUpdateBlockMutation";
import z from "zod";
import { useUpdateBlockPositionsMutation } from "./hooks/useUpdateBlockPositionsMutation";

interface BlockEditorProps {
    documentId?: string;
    updateDocument: (document: Document) => void;
}

function diffNodes(prevDoc: ProsemirrorNode, currentDoc: ProsemirrorNode) {
    const prevNodesMap = new Map<
        string,
        { node: ProsemirrorNode; index: number }
    >();
    const currentNodesMap = new Map<
        string,
        { node: ProsemirrorNode; index: number }[] // Changed to array to store multiple nodes with same ID
    >();
    console.debug("currentDoc:", currentDoc.toJSON());
    console.debug("prevDoc:", prevDoc.toJSON());
    prevDoc.content.forEach((node, _, index) => {
        // Ensure node has an ID and is considered a block-level node
        if (node.attrs.id && node.type.isBlock) {
            // if (prevNodesMap.has(node.attrs.id)) {
            //     throw new Error(
            //         `Duplicate ID found in previous document: ${node.attrs.id}`
            //     );
            // }
            prevNodesMap.set(node.attrs.id, { node, index });
        }
    });

    // Modified to handle multiple nodes with the same ID
    currentDoc.content.forEach((node, _, index) => {
        if (node.attrs.id && node.type.isBlock) {
            if (!currentNodesMap.has(node.attrs.id)) {
                currentNodesMap.set(node.attrs.id, []);
            }
            currentNodesMap.get(node.attrs.id)!.push({ node, index });
        }
    });

    const added: { node: ProsemirrorNode; index: number; newId?: string }[] =
        [];
    const deleted: string[] = [];
    // Store the full node data for modification checks
    const modified: {
        node: ProsemirrorNode;
        index: number;
        prevNode: ProsemirrorNode;
    }[] = [];
    let moved = false; // Flag to check if any node's relative position changed

    // Check for deletions and modifications/moves
    for (const [id, prevData] of prevNodesMap.entries()) {
        const currentDataArray = currentNodesMap.get(id) || [];
        if (currentDataArray.length === 0) {
            deleted.push(id);
        } else {
            // Use the first instance for checking modifications/moves
            const currentData = currentDataArray[0];
            // Remove from array after processing to track which were handled
            currentDataArray.shift();

            // More robust check: compare JSON representations for content and attrs
            const contentChanged =
                JSON.stringify(currentData.node.content.toJSON()) !==
                JSON.stringify(prevData.node.content.toJSON());
            const attrsChanged =
                JSON.stringify(currentData.node.attrs) !==
                JSON.stringify(prevData.node.attrs);
            const positionChanged = currentData.index !== prevData.index;

            if (contentChanged || attrsChanged) {
                modified.push({ ...currentData, prevNode: prevData.node });
            }
            if (positionChanged) {
                moved = true;
            }

            // Any remaining nodes with this ID are considered duplicates and need new IDs
            currentDataArray.forEach((dupData) => {
                const newId = uuidv4();
                added.push({ ...dupData, newId });
            });
        }
    }

    // Check for additions
    for (const [id, currentDataArray] of currentNodesMap.entries()) {
        if (!prevNodesMap.has(id)) {
            // First occurrence uses original ID
            if (currentDataArray.length > 0) {
                added.push(currentDataArray[0]);

                // Additional occurrences need new IDs
                for (let i = 1; i < currentDataArray.length; i++) {
                    const newId = uuidv4();
                    added.push({ ...currentDataArray[i], newId });
                }
            }
        }
    }

    // Determine if position update is needed
    const needsPositionUpdate = moved || added.length > 0 || deleted.length > 0;

    return { added, deleted, modified, needsPositionUpdate };
}

export const useBlockEditor = ({
    documentId,
    updateDocument,
    ...editorOptions
}: BlockEditorProps) => {
    const { data: docContent, isSuccess } = useDocumentContentQueries(
        documentId || "",
        !!documentId
    );
    const isInternalUpdate = useRef(false);
    const prevDocumentId = useRef<string | null>(null);
    const lastProcessedDoc = useRef<ProsemirrorNode | null>(null); // Add this ref to track last processed state
    const { mutateAsync: deleteBlock } = useDeleteBlockMutation();
    const { mutateAsync: createBlock } = useCreateBlockMutation();
    const { mutateAsync: updateBlock } = useUpdateBlockMutation();
    const { mutateAsync: updateBlockPos } = useUpdateBlockPositionsMutation();
    const uuidSchema = z.uuid();
    // console.debug("Document content:", docContent?.allContent);
    const processTransaction = useCallback(
        debounce(
            async (
                editor: Editor,
                prevDoc: ProsemirrorNode | null,
                currentDoc: ProsemirrorNode
            ) => {
                if (!documentId || !isSuccess || !currentDoc) return;

                // Use the stored last processed doc or the provided prevDoc
                const docToCompare = lastProcessedDoc.current || prevDoc;

                if (!docToCompare) return;

                console.debug("Processing transaction...");

                // isInternalUpdate.current = true; // Mark start of internal processing

                const promises: Promise<any>[] = [];
                const changes = diffNodes(docToCompare, currentDoc);
                const idUpdates = new Map<string, string>();
                const { added, deleted, modified, needsPositionUpdate } =
                    changes;
                console.debug("added:", added);
                console.debug("deleted:", deleted);
                console.debug("modified:", modified);
                console.debug("needsPositionUpdate:", needsPositionUpdate);
                // 1. Handle Deletions
                deleted.forEach((id) => {
                    console.debug(`Node deleted: ${id}, parse`);
                    if (!uuidSchema.safeParse(id).success)
                        promises.push(deleteBlock({ blockId: id, documentId }));
                });

                // // 2. Handle Additions
                added.forEach((addData) => {
                    // Check if this node has a new ID assigned due to being a duplicate
                    const tempId = addData.node.attrs.id; // The original ID
                    const contentToSend = addData.node.toJSON();

                    // If this is a duplicate node that needs a new ID, update it before sending
                    if (addData.newId) {
                        contentToSend.attrs = {
                            ...contentToSend.attrs,
                            id: addData.newId,
                        };
                        console.debug(
                            `Using new ID for duplicate node: ${addData.newId} (was ${tempId})`
                        );
                    }

                    console.debug(`Node added (tempId): ${tempId}`);
                    promises.push(
                        createBlock({
                            documentId,
                            content: contentToSend, // Send node JSON with possibly updated ID
                        }).then((response) => {
                            // The direct response should now contain the data
                            console.debug(
                                `Node ${tempId} created with response:`,
                                response
                            );
                            if (response?.data?.id) {
                                const backendId = String(response.data.id);
                                console.debug(
                                    `Node ${tempId} created with backend ID: ${backendId}`
                                );
                                // Store mapping from temp ID (or newId for duplicates) to backend ID
                                const idToUpdate = addData.newId || tempId;
                                idUpdates.set(idToUpdate, backendId);
                            } else {
                                console.error(
                                    `Failed to create block for tempId ${tempId} or missing ID in response.`
                                );
                                // Potentially throw error to stop position update?
                            }
                        })
                    );
                });

                // // 3. Handle Modifications
                modified.forEach((modData) => {
                    const blockId = modData.node.attrs.id;
                    console.debug(`Node modified: ${blockId}`);
                    if (uuidSchema.safeParse(blockId).success) return;
                    promises.push(
                        updateBlock({
                            blockId,
                            content: modData.node.toJSON(), // Send full node JSON
                            documentId,
                        }).then((response) => {
                            // Although update response has ID, it should match blockId.
                            // We mainly care about success here. If the backend *could* change ID on update, handle like create.
                            if (!response) {
                                console.error(
                                    `Failed to update block ${blockId}.`
                                );
                                // Potentially throw error
                            } else {
                                console.debug(
                                    `Node ${blockId} updated successfully.`
                                );
                                // If backend *could* return a different ID on update:
                                // const backendId = String(response.id);
                                // if (backendId !== blockId) {
                                //    idUpdates.set(blockId, backendId);
                                // }
                            }
                        })
                    );
                });

                try {
                    // Wait for all individual add/update/delete API calls
                    await Promise.all(promises);
                    console.debug("Individual block mutations completed.");

                    console.debug(
                        "Updating node IDs in editor state...",
                        idUpdates
                    );
                    // 4. Update Editor Node IDs if necessary (after successful creates)
                    if (idUpdates.size > 0) {
                        let idUpdateTr = editor.state.tr;
                        let idUpdated = false;
                        // Use the *current* document state which reflects the transaction being processed
                        currentDoc.descendants((node, pos) => {
                            if (!node.attrs.id || !node.type.isBlock) return; // Skip nodes without ID or non-blocks

                            const currentId = node.attrs.id;
                            if (idUpdates.has(currentId)) {
                                const backendId = idUpdates.get(currentId)!;
                                console.debug(
                                    `Updating node ID in editor: ${currentId} -> ${backendId} at pos ${pos}`
                                );
                                // Ensure we don't try to update the same node multiple times in one transaction if duplicates exist
                                idUpdates.delete(currentId);
                                // Create a new node object with updated attributes
                                const newNodeAttrs = {
                                    ...node.attrs,
                                    id: backendId,
                                };
                                // Replace the node with a new one having the updated attributes
                                // Using setNodeMarkup is generally safer than setNodeAttribute for complex changes or potential schema issues
                                idUpdateTr = idUpdateTr.setNodeMarkup(
                                    pos,
                                    undefined,
                                    newNodeAttrs
                                );
                                idUpdated = true;
                            }
                        });

                        if (idUpdated) {
                            console.debug(
                                "Dispatching internal transaction to update node IDs."
                            );
                            // Mark as internal update before dispatching to prevent infinite loop
                            isInternalUpdate.current = true;
                            // Dispatch synchronously to update the editor state with backend IDs
                            editor.view.dispatch(idUpdateTr);
                            console.debug("Node IDs updated in editor state.");
                        }
                    }

                    // 5. Update Block Positions if needed
                    if (needsPositionUpdate) {
                        console.debug(
                            "Change detected, updating block positions..."
                        );
                        const finalBlockIds: string[] = [];
                        // Get IDs from the *latest* editor state after potential ID updates
                        const invalidIds: string[] = [];
                        editor.state.doc.content.forEach((node) => {
                            if (node.attrs.id && node.type.isBlock) {
                                // Skip nodes with UUID format instead of throwing error
                                if (
                                    uuidSchema.safeParse(node.attrs.id).success
                                ) {
                                    console.warn(
                                        `Skipping temporary UUID in position update: ${node.attrs.id}`
                                    );
                                    invalidIds.push(node.attrs.id);
                                } else {
                                    finalBlockIds.push(node.attrs.id);
                                }
                            }
                        });

                        if (invalidIds.length > 0) {
                            console.warn(
                                `Found ${invalidIds.length} unprocessed UUID(s) during position update`,
                                invalidIds
                            );
                        }

                        if (finalBlockIds.length > 0) {
                            console.debug(
                                "Calling updateBlockPositions with IDs:",
                                finalBlockIds
                            );
                            await updateBlockPos({
                                documentId,
                                blockIds: finalBlockIds,
                            });
                            console.debug(
                                "Block positions update call finished."
                            );
                        } else {
                            console.debug(
                                "Skipping position update as no blocks remain."
                            );
                        }
                    } else {
                        console.debug(
                            "No changes requiring position update detected."
                        );
                    }

                    console.debug("Transaction batch processed successfully.");
                } catch (error) {
                    console.error("Error processing transaction batch:", error);
                    // TODO: Implement robust error handling:
                    // - Notify user
                    // - Potentially revert editor state to `prevDoc`? (complex)
                    // - Invalidate query cache to refetch correct state from backend
                    // queryClient.invalidateQueries({
                    //     queryKey: ["documentContent", documentId],
                    // });
                } finally {
                    // Use setTimeout to ensure this runs *after* the current execution context
                    // and any synchronous dispatches within this function.
                    setTimeout(() => {
                        console.debug("Resetting isInternalUpdate flag.");
                        // Store the current doc as the last processed state
                        lastProcessedDoc.current = editor.state.doc;
                        isInternalUpdate.current = false;
                    }, 0);
                }
            },
            1000 // Reduce debounce time for better responsiveness while still batching
        ),
        [documentId, isSuccess]
    );

    const editor = useEditor({
        ...editorOptions,
        autofocus: true,
        immediatelyRender: false,
        // Ensure the custom Paragraph is used
        extensions: [...ExtensionKit()],
        editorProps: {
            attributes: {
                autocomplete: "off",
                autocorrect: "off",
                autocapitalize: "off",
                spellcheck: "false",
            },
        },
        // onUpdate: onUpdate,
        // onCreate({ editor }) {
        //     // Only set content if editor is empty or if document has content
        //     if (!editor.isEmpty || (document && document.content.length > 0)) {
        //         editor.commands.setContent(
        //             { type: "doc", content: document?.content },
        //             false
        //         );
        //         // Save initial document ID
        //         if (document) {
        //             prevDocumentId.current = document.id;
        //         }
        //     } else {
        //         // Explicitly set an empty heading
        //         editor.commands.setNode("heading", { level: 1 });
        //     }
        // },
        onTransaction: ({ editor, transaction }) => {
            if (!transaction.docChanged || isInternalUpdate.current) {
                // If the document didn't change or it's an internal update, do nothing
                return;
            }

            // Get current document state
            const currentDoc = editor.state.doc;

            // Call the debounced processing function, always comparing with lastProcessedDoc
            processTransaction(editor, transaction.before, currentDoc);
        },
    });

    // Clear the lastProcessedDoc when document changes
    useEffect(() => {
        if (editor && documentId) {
            lastProcessedDoc.current = null;
        }
    }, [documentId]);

    // Enhanced effect to handle document changes
    useEffect(() => {
        if (!editor || !isSuccess) return;

        // Skip if this is an update triggered by the editor itself
        // if (isInternalUpdate.current) return;

        const currentDocId = documentId;

        // Only update content if document ID has changed
        if (currentDocId && currentDocId !== prevDocumentId.current) {
            // Need to use setTimeout to ensure the clear completes first
            setTimeout(() => {
                isInternalUpdate.current = true;
                editor.commands.clearContent();
                editor.commands.setContent(
                    { type: "doc", content: docContent?.allContent as any },
                    false
                );
                prevDocumentId.current = currentDocId;
                setTimeout(() => {
                    console.debug(
                        "Internal update: Resetting flag after ID change load."
                    );
                    isInternalUpdate.current = false;
                }, 0);
            }, 0);
        }
    }, [editor, documentId, isSuccess]);

    useEffect(() => {
        const currentDocId = documentId;
        if (currentDocId !== prevDocumentId.current) return;
        if (editor && !isInternalUpdate.current && isSuccess) {
            setTimeout(() => {
                isInternalUpdate.current = true; // <-- Set flag before setContent
                editor.commands.setContent(
                    { type: "doc", content: docContent?.allContent as any },
                    false // Don't trigger transaction
                );
                // Reset the flag after the update has likely processed
                setTimeout(() => {
                    console.debug(
                        "Internal update: Resetting flag after external update load."
                    );
                    isInternalUpdate.current = false; // <-- Reset flag
                }, 0);
            });
        }
    }, [editor, isSuccess]);

    useEffect(() => {
        if (!editor) return;

        const handleCopy = (e: ClipboardEvent) => {
            const { selection } = editor.state;
            // console.debug("Selection type:", selection.constructor.name);
            // Handle NodeSelection separately to ensure content is copied
            if (selection instanceof NodeSelection) {
                // console.debug("Selected node id:", selection.node.attrs.id);
                // Prevent default to handle our own copy
                e.preventDefault();
                // Get HTML representation of the selected node
                const fragment = selection.content();
                const clipboardHTML =
                    editor.view.serializeForClipboard(fragment).dom.innerHTML;
                // console.debug("Clipboard data:", clipboardHTML);
                if (e.clipboardData) {
                    e.clipboardData.setData("text/html", clipboardHTML);
                    e.clipboardData.setData(
                        "text/plain",
                        selection.node.textContent
                    );
                }
            }
        };

        window.addEventListener("copy", handleCopy);
        return () => {
            window.removeEventListener("copy", handleCopy);
        };
    }, [editor]);

    return { editor };
};
