import ExtensionKit from "@/extensions/ExtensionKit";
import { Editor, useEditor } from "@tiptap/react";
import { Document } from "@/app/models/entity/Document";
import { useCallback, useEffect, useRef } from "react";
import { NodeSelection } from "@tiptap/pm/state";
import { useDocumentContentQueries } from "./hooks/useDocumentContentQueries";
import { debounce } from "lodash";
import { Node as ProsemirrorNode } from "prosemirror-model";
import { v4 as uuidv4 } from "uuid";
import { useDeleteBlockMutation } from "./hooks/useDeleteBlockMutation";
import { useCreateBlockMutation } from "./hooks/useCreateBlockMutation";
import { useUpdateBlockMutation } from "./hooks/useUpdateBlockMutation";
import z from "zod";
import { useUpdateBlockPositionsMutation } from "./hooks/useUpdateBlockPositionsMutation";
import { useToast } from "@/hooks/use-toast";
import SaveStatus from "../models/enum/SaveStatus";

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
        { node: ProsemirrorNode; index: number }[]
    >();

    // console.debug("currentDoc:", currentDoc.toJSON());
    // console.debug("prevDoc:", prevDoc.toJSON());
    prevDoc.content.forEach((node, _, index) => {
        // Ensure node has an ID and is considered a block-level node
        if (node.attrs.id && node.type.isBlock) {
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
    // Get states from hooks
    const {
        data: docContent,
        isLoading: isDocumentLoading,
        isError: isDocumentError,
        isSuccess: isDocumentSuccess,
    } = useDocumentContentQueries(documentId || "", !!documentId); // Ensure query is enabled only with ID

    const {
        mutateAsync: deleteBlock,
        isPending: isDeleteSuccess,
        isError: isDeleteError,
    } = useDeleteBlockMutation();
    const {
        mutateAsync: createBlock,
        isPending: isCreateSuccess,
        isError: isCreateError,
    } = useCreateBlockMutation();
    const {
        mutateAsync: updateBlock,
        isPending: isUpdateSuccess,
        isError: isUpdateError,
    } = useUpdateBlockMutation();
    const {
        mutateAsync: updateBlockPos,
        isPending: isPositionUpdateSuccess,
        isError: isPositionUpdateError,
    } = useUpdateBlockPositionsMutation();
    const currentStatus = useCallback((): SaveStatus => {
        const hasError =
            isDocumentError ||
            isDeleteError ||
            isCreateError ||
            isUpdateError ||
            isPositionUpdateError;
        const isSaving =
            isDeleteSuccess ||
            isCreateSuccess ||
            isUpdateSuccess ||
            isPositionUpdateSuccess;

        if (hasError) return SaveStatus.Error;
        if (isDocumentLoading) return SaveStatus.Connecting; // Initial load or refetch
        if (isSaving) return SaveStatus.Saving;
        if (isDocumentSuccess && !isSaving && !hasError)
            return SaveStatus.Saved; // Document loaded and no operations active/failed

        return SaveStatus.Idle; // Default or fallback state
    }, [
        isDocumentLoading,
        isDocumentError,
        isDocumentSuccess,
        isDeleteSuccess,
        isDeleteError,
        isCreateSuccess,
        isCreateError,
        isUpdateSuccess,
        isUpdateError,
        isPositionUpdateSuccess,
        isPositionUpdateError,
    ]);
    const { toast } = useToast();
    const isInternalUpdate = useRef(false);
    const prevDocumentId = useRef<string | null>(null);
    const lastProcessedDoc = useRef<ProsemirrorNode | null>(null); // to track last processed state
    const uuidSchema = z.uuid();

    const processTransaction = useCallback(
        debounce(
            async (
                editor: Editor,
                prevDoc: ProsemirrorNode | null,
                currentDoc: ProsemirrorNode
            ) => {
                if (!documentId || !isDocumentSuccess || !currentDoc) return;

                // Use the stored last processed doc or the provided prevDoc
                const docToCompare = lastProcessedDoc.current || prevDoc;

                if (!docToCompare) return;

                const promises: Promise<any>[] = [];
                const changes = diffNodes(docToCompare, currentDoc);
                const idUpdates = new Map<string, string>();
                const { added, deleted, modified, needsPositionUpdate } =
                    changes;
                // console.debug("addeds added);
                // console.debug("deleted:", deleted);
                // console.debug("modified:", modified);
                // console.debug("needsPositionUpdate:", needsPositionUpdate);
                // Handle Deletions
                deleted.forEach((id) => {
                    if (!uuidSchema.safeParse(id).success)
                        promises.push(deleteBlock({ blockId: id, documentId }));
                });

                // Handle Additions
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
                    }

                    promises.push(
                        createBlock({
                            documentId,
                            content: contentToSend, // Send node JSON with possibly updated ID
                        }).then((response) => {
                            if (response?.data?.id) {
                                const backendId = String(response.data.id);
                                // Store mapping from temp ID (or newId for duplicates) to backend ID
                                const idToUpdate = addData.newId || tempId;
                                idUpdates.set(idToUpdate, backendId);
                            } else {
                                toast({
                                    title: "Error",
                                    description: "Failed to update content.",
                                    variant: "destructive",
                                });
                            }
                        })
                    );
                });

                // Handle Modifications
                modified.forEach((modData) => {
                    const blockId = modData.node.attrs.id;
                    if (uuidSchema.safeParse(blockId).success) return;
                    promises.push(
                        updateBlock({
                            blockId,
                            content: modData.node.toJSON(),
                            documentId,
                        }).then((response) => {
                            // Although update response has ID, it should match blockId.
                            // We mainly care about success here. If the backend *could* change ID on update, handle like create.
                            if (!response) {
                                toast({
                                    title: "Error",
                                    description: "Failed to update content.",
                                    variant: "destructive",
                                });
                            }
                        })
                    );
                });

                try {
                    // Wait for all individual add/update/delete API calls
                    await Promise.all(promises);
                    //  Update Editor Node IDs if necessary (after successful creates)
                    if (idUpdates.size > 0) {
                        let idUpdateTr = editor.state.tr;
                        let idUpdated = false;
                        // Use the *current* document state which reflects the transaction being processed
                        currentDoc.descendants((node, pos) => {
                            if (!node.attrs.id || !node.type.isBlock) return; // Skip nodes without ID or non-blocks

                            const currentId = node.attrs.id;
                            if (idUpdates.has(currentId)) {
                                const backendId = idUpdates.get(currentId)!;

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
                            // Mark as internal update before dispatching to prevent infinite loop
                            isInternalUpdate.current = true;
                            // Dispatch synchronously to update the editor state with backend IDs
                            editor.view.dispatch(idUpdateTr);
                        }
                    }

                    //Update Block Positions if needed
                    if (needsPositionUpdate) {
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
                            await updateBlockPos({
                                documentId,
                                blockIds: finalBlockIds,
                            });
                        }
                    }
                } catch (error) {
                    toast({
                        title: "Error",
                        description: "Content update failed.",
                        variant: "destructive",
                    });
                    // queryClient.invalidateQueries({
                    //     queryKey: ["documentContent", documentId],
                    // });
                } finally {
                    // Use setTimeout to ensure this runs *after* the current execution context
                    // and any synchronous dispatches within this function.
                    setTimeout(() => {
                        // Store the current doc as the last processed state
                        lastProcessedDoc.current = editor.state.doc;
                        isInternalUpdate.current = false;
                    }, 0);
                }
            },
            1000 // Reduce debounce time for better responsiveness while still batching
        ),
        [documentId, isDocumentSuccess]
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
        onTransaction: ({ editor, transaction }) => {
            // If the document didn't change or it's an internal update, do nothing
            if (!transaction.docChanged || isInternalUpdate.current) {
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
        if (!editor || !isDocumentSuccess) return;

        // Skip if this is an update triggered by the editor itself
        if (isInternalUpdate.current) return;

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
                    isInternalUpdate.current = false;
                }, 0);
            }, 0);
        }
    }, [editor, documentId, isDocumentSuccess]);

    useEffect(() => {
        const currentDocId = documentId;
        if (currentDocId !== prevDocumentId.current) return;
        if (editor && !isInternalUpdate.current && isDocumentSuccess) {
            setTimeout(() => {
                isInternalUpdate.current = true;
                editor.commands.setContent(
                    { type: "doc", content: docContent?.allContent as any },
                    false // Don't trigger transaction
                );
                // Reset the flag after the update has likely processed
                setTimeout(() => {
                    isInternalUpdate.current = false;
                }, 0);
            });
        }
    }, [editor, isDocumentSuccess]);

    useEffect(() => {
        if (!editor) return;

        const handleCopy = (e: ClipboardEvent) => {
            const { selection } = editor.state;
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

    return {
        editor,
        currentStatus,
    };
};
