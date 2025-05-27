"use client";
import ExtensionKit from "@/extensions/ExtensionKit";
import { useEditor } from "@tiptap/react";
import { useEffect } from "react";
import { NodeSelection } from "@tiptap/pm/state";
import {
    // setupAIEventHandlers,
    cleanupAIEventHandlers,
} from "@/extensions/ExtensionUtils";
import { Collaboration } from "@tiptap/extension-collaboration";
import { CollaborationCursor } from "@tiptap/extension-collaboration-cursor";
import { HocuspocusProvider } from "@hocuspocus/provider";

interface BlockEditorProps {
    documentId?: string;
    collaborationProvider: HocuspocusProvider;
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
    const editor = useEditor(
        {
            ...editorOptions,
            autofocus: true,
            immediatelyRender: true,
            extensions: [
                ...ExtensionKit(),
                Collaboration.configure({
                    document: collaborationProvider.document,
                }),
                CollaborationCursor.configure({
                    provider: collaborationProvider,
                }),
            ],
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
        // Only watch the collaboration document for changes when it exists
        [collaborationProvider?.document]
    );

    useEffect(() => {
        if (!editor) return;

        const handleCopy = (e: ClipboardEvent) => {
            const { selection } = editor.state;
            // Handle NodeSelection separately to ensure content is copied
            if (selection instanceof NodeSelection) {
                // Prevent default to handle our own copy
                e.preventDefault();
                // Get HTML representation of the selected node
                const fragment = selection.content();
                const clipboardHTML =
                    editor.view.serializeForClipboard(fragment).dom.innerHTML;
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
        docContent: editor?.state.toJSON(),
        editorDoc: editor?.state.doc,
        editor,
        // currentStatus, // This will be used for non-collaborative mode
    };
};
