import ExtensionKit from "@/extensions/ExtensionKit";
import { Editor, EditorOptions, useEditor } from "@tiptap/react";
import { JsonObject } from "@/app/models/types/JsonObject";
import { Document } from "@/app/models/entity/Document";
import tmp from "@/app/components/doc/tmp.json";
interface BlockEditorProps {
    document?: Document;
    updateDocument: (document: Document) => void;
}
declare global {
    interface Window {
        editor: Editor | null;
    }
}
export const useBlockEditor = ({
    document,
    updateDocument,
    ...editorOptions
}: BlockEditorProps & Partial<Omit<EditorOptions, "extensions">>) => {
    const initialContent = document
        ? { type: "doc", content: document.getContent() }
        : { type: "doc", content: [] };
    const editor = useEditor({
        ...editorOptions,
        shouldRerenderOnTransaction: false,
        // autofocus: true,
        extensions: [...ExtensionKit()],
        editorProps: {
            attributes: {
                class: "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none min-h-full",
                autocomplete: "off",
                autocorrect: "off",
                autocapitalize: "off",
            },
        },
        // content: initialContent,
        // content: tmp,
        onUpdate({ editor }) {
            console.debug(editor.getJSON().content);
            const updatedContent = editor.getJSON().content as JsonObject[];
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

    // useEffect(() => {
    //     window.editor = editor as Editor;
    // }, [editor]);

    return { editor };
};
