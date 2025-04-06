import ExtensionKit from "@/extensions/ExtensionKit";
import { Editor, useEditor } from "@tiptap/react";
import { Document } from "@/app/models/entity/Document";
import { useCallback, useEffect, useRef } from "react";
import { NodeSelection } from "@tiptap/pm/state";
import {
    setupAIEventHandlers,
    cleanupAIEventHandlers,
} from "@/extensions/ExtensionUtils";

interface BlockEditorProps {
    document?: Document;
    updateDocument: (document: Document) => void;
}

export const useBlockEditor = ({
    document,
    updateDocument,
    ...editorOptions
}: BlockEditorProps) => {
    const isInternalUpdate = useRef(false);
    const prevDocumentId = useRef<string | null>(null);
    const onUpdate = useCallback(
        ({ editor }: { editor: Editor }) => {
            isInternalUpdate.current = true;
            const updatedContent = editor.getJSON().content;

            if (document && updatedContent) {
                document.content = updatedContent;
                updateDocument(document);
            }
            //next tick to avoid state update in render
            setTimeout(() => {
                isInternalUpdate.current = false;
            }, 0);
        },
        [document, updateDocument]
    );
    const editor = useEditor({
        ...editorOptions,
        autofocus: true,
        immediatelyRender: false,
        extensions: [...ExtensionKit()],
        editorProps: {
            attributes: {
                autocomplete: "off",
                autocorrect: "off",
                autocapitalize: "off",
                spellcheck: "false",
            },
        },
        onUpdate: onUpdate,
        onCreate({ editor }) {
            setupAIEventHandlers(editor, editor.storage);

            // Only set content if editor is empty or if document has content
            if (!editor.isEmpty || (document && document.content.length > 0)) {
                editor.commands.setContent(
                    { type: "doc", content: document?.content },
                    false
                );
                // Save initial document ID
                if (document) {
                    prevDocumentId.current = document.id;
                }
            } else {
                // Explicitly set an empty heading
                editor.commands.setNode("heading", { level: 1 });
            }
        },
        onDestroy() {
            if (editor && editor.storage) {
                cleanupAIEventHandlers(editor.storage);
            }
        },
    });

    // Enhanced effect to handle document changes
    useEffect(() => {
        if (!editor || !document) return;

        // Skip if this is an update triggered by the editor itself
        if (isInternalUpdate.current) return;

        const currentDocId = document.id;

        // Only update content if document ID has changed
        if (currentDocId !== prevDocumentId.current) {
            // Need to use setTimeout to ensure the clear completes first
            setTimeout(() => {
                editor.commands.clearContent();
                editor.commands.setContent(
                    { type: "doc", content: document.content },
                    false
                );
                prevDocumentId.current = currentDocId;
            }, 0);
        }
    }, [editor, document?.id, document]);

    useEffect(() => {
        const currentDocId = document?.id;
        if (currentDocId !== prevDocumentId.current) return;
        if (document && editor && !isInternalUpdate.current) {
            editor.commands.setContent(
                { type: "doc", content: document.content },
                false
            );
        }
    }, [document, editor]);

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
    }, [document, editor]);

    return { editor };
};
