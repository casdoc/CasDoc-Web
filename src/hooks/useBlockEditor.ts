import ExtensionKit from "@/extensions/ExtensionKit";
import { Editor, EditorOptions, useEditor } from "@tiptap/react";
import { useEffect } from "react";
import { JsonObject } from "@/app/models/types/JsonObject";
import { Document } from "@/app/models/entity/Document";
interface BlockEditorProps {
    document?: Document;
    updateDocument: (document: Document) => void;
    editorOptions?: Partial<Omit<EditorOptions, "extensions">>;
}
declare global {
    interface Window {
        editor: Editor | null;
    }
}
export const useBlockEditor = ({
    document,
    updateDocument,
    editorOptions,
}: BlockEditorProps) => {
    const initialContent = document
        ? { type: "doc", content: document.getContent() }
        : { type: "doc", content: [] };
    const editor = useEditor({
        ...editorOptions,
        extensions: [...ExtensionKit()],
        editorProps: {
            attributes: {
                class: "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none",
            },
        },
        content: initialContent,
        onUpdate({ editor }) {
            const updatedContent = editor.getJSON().content as JsonObject[];
            // console.debug("updatedContent", updatedContent);
            document?.setAllContent(updatedContent);
            if (document) updateDocument(document);
        },
        onCreate({ editor }) {
            editor.commands.setContent(
                { type: "doc", content: document?.getContent() },
                false
            );
        },
    });

    useEffect(() => {
        window.editor = editor as Editor;
    }, [editor]);
    return { editor };
};
