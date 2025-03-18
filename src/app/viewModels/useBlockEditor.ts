import ExtensionKit from "@/extensions/ExtensionKit";
import { Editor, EditorOptions, useEditor } from "@tiptap/react";
import { Document } from "@/app/models/entity/Document";
import { useCallback, useEffect, useRef } from "react";
import { useNodeSelection } from "./context/NodeSelectionContext";
import { Extension } from "@tiptap/core";

interface BlockEditorProps {
    document?: Document;
    updateDocument: (document: Document) => void;
}

export const useBlockEditor = ({
    document,
    updateDocument,
    ...editorOptions
}: BlockEditorProps & Partial<Omit<EditorOptions, "extensions">>) => {
    const isInternalUpdate = useRef(false);
    const { selectNode } = useNodeSelection();

    const CustomCommandWithContext = Extension.create({
        name: "customCommandWithContext",
        addCommands() {
            return {
                toggleContextValue:
                    () =>
                    ({}) => {
                        const { selection } = this.editor.state;
                        selectNode(selection.node.attrs.id);
                        return true;
                    },
            };
        },
    });

    const onUpdate = useCallback(
        ({ editor }: { editor: Editor }) => {
            isInternalUpdate.current = true;
            const updatedContent = editor.getJSON().content;
            if (document && updatedContent) {
                document.setAllContent(updatedContent);
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
        extensions: [...ExtensionKit(), CustomCommandWithContext],
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
            // Only set content if editor is empty or if document has content
            if (
                !editor.isEmpty ||
                (document && document.getContent().length > 0)
            ) {
                editor.commands.setContent(
                    { type: "doc", content: document?.getContent() },
                    false
                );
            } else {
                // Explicitly set an empty heading
                editor.commands.setNode("heading", { level: 1 });
            }
        },
    });
    useEffect(() => {
        if (document && editor && !isInternalUpdate.current) {
            editor.commands.setContent(
                { type: "doc", content: document.getContent() },
                false
            );
        }
    }, [document, editor]);

    return { editor };
};
