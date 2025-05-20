import ExtensionKit from "@/extensions/ExtensionKit";
import { useEditor } from "@tiptap/react";
import { useEffect, useMemo } from "react";
import { NodeSelection } from "@tiptap/pm/state";
import {
    // setupAIEventHandlers,
    cleanupAIEventHandlers,
} from "@/extensions/ExtensionUtils";
import { Collaboration } from "@tiptap/extension-collaboration";
import { CollaborationCursor } from "@tiptap/extension-collaboration-cursor";
import { HocuspocusProvider } from "@hocuspocus/provider";
import * as Y from "yjs";

interface BlockEditorProps {
    documentId?: string;
    collaborationProvider?: HocuspocusProvider; // HocuspocusProvider
    // collaborationDocument?: Y.Doc | null;
    collaborationOptions?: {
        user: {
            name: string;
            color: string;
        };
    };
}

export const useBlockEditor = ({
    collaborationProvider,
    ...editorOptions
}: BlockEditorProps) => {
    const extensions = useMemo(() => {
        const base = [...ExtensionKit()];
        if (collaborationProvider) {
            base.push(
                Collaboration.configure({
                    document: collaborationProvider.document,
                }),
                CollaborationCursor.configure({
                    provider: collaborationProvider,
                })
            );
        }
        return base;
    }, [collaborationProvider]);
    // if (!collaborationProvider?.document) return;
    const editor = useEditor(
        {
            ...editorOptions,
            autofocus: true,
            immediatelyRender: false,
            extensions: extensions,
            editorProps: {
                attributes: {
                    autocomplete: "off",
                    autocorrect: "off",
                    autocapitalize: "off",
                    spellcheck: "false",
                },
            },
            onDestroy() {
                if (editor && editor.storage) {
                    cleanupAIEventHandlers(editor.storage);
                }
            },
        },
        [collaborationProvider?.document]
    );

    // Clear the lastProcessedDoc when document changes
    // useEffect(() => {
    //     if (editor && documentId) {
    //         lastProcessedDoc.current = null;
    //     }
    // }, [documentId, editor]);

    // Enhanced effect to handle document changes
    // useEffect(() => {
    //     if (!editor) return;

    //     // Only update content if document ID has changed
    //     if (documentId && documentId !== prevDocumentId.current) {
    //         // Need to use setTimeout to ensure the clear completes first
    //         setTimeout(() => {
    //             editor.commands.clearContent();
    //             editor.commands.setContent(
    //                 // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //                 { type: "doc", content: docContent?.allContent as any },
    //                 false
    //             );
    //             prevDocumentId.current = documentId;
    //             // Set initial state for proper comparison
    //             lastProcessedDoc.current = editor.state.doc;
    //         }, 0);
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [editor, documentId, isDocumentSuccess]);

    // Effect to handle updates when document ID is the same
    // useEffect(() => {
    //     if (documentId !== prevDocumentId.current) return;
    //     if (editor && !isInternalUpdate.current && isDocumentSuccess) {
    //         setTimeout(() => {
    //             isInternalUpdate.current = true;
    //             editor.commands.setContent(
    //                 // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //                 { type: "doc", content: docContent?.allContent as any }
    //                 // false // Don't trigger transaction
    //             );
    //             // Set the processed document to match the fresh content
    //             lastProcessedDoc.current = editor.state.doc;
    //             isInitialLoad.current = true;
    //             // Reset the flag after the update has likely processed
    //             setTimeout(() => {
    //                 isInternalUpdate.current = false;
    //             }, 0);
    //         });
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [editor, isDocumentSuccess, documentId]);

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
    // console.debug("editor:", editor?.state.doc);
    return {
        docContent: editor?.state.toJSON(),
        editorDoc: editor?.state.doc,
        editor,
        // currentStatus, // This will be used for non-collaborative mode
    };
};
