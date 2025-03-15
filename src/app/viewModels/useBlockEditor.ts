import ExtensionKit from "@/extensions/ExtensionKit";
import { EditorOptions, useEditor } from "@tiptap/react";
import { JsonObject } from "@/app/models/types/JsonObject";
import { Document } from "@/app/models/entity/Document";

interface BlockEditorProps {
    document?: Document;
    updateDocument: (document: Document) => void;
}

export const useBlockEditor = ({
    document,
    updateDocument,
    ...editorOptions
}: BlockEditorProps & Partial<Omit<EditorOptions, "extensions">>) => {
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
        onUpdate({ editor }) {
            const updatedContent = editor.getJSON().content as JsonObject[];
            document?.setAllContent(updatedContent);
            if (document) updateDocument(document);
        },
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

    return { editor };
};
