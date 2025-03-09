import ExtensionKit from "@/extensions/ExtensionKit";
import { Editor, EditorOptions, useEditor } from "@tiptap/react";
import tmpData from "@/app/components/doc/tmp.json";
interface BlockEditorProps {
    editorOptions?: Partial<Omit<EditorOptions, "extensions">>;
}
declare global {
    interface Window {
        editor: Editor | null;
    }
}
export const useBlockEditor = ({ editorOptions }: BlockEditorProps) => {
    const editor = useEditor({
        ...editorOptions,
        extensions: [...ExtensionKit()],
        editorProps: {
            attributes: {
                class: "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none",
            },
        },
        immediatelyRender: false,
        content: tmpData,
    });
    // window.editor = editor;
    return { editor };
};
