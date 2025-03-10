import ExtensionKit from "@/extensions/ExtensionKit";
import { EditorOptions, useEditor } from "@tiptap/react";
import { JsonObject } from "@/app/models/types/JsonObject";
import { Document } from "@/app/models/entity/Document";
// import tmp from "@/app/components/doc/tmp.json";
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
                class: "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none min-h-full",
                autocomplete: "off",
                autocorrect: "off",
                autocapitalize: "off",
            },
        },

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

    return { editor };
};
