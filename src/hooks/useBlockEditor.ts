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
        onUpdate({ editor }) {},
        // content: tmpData
        content: `
         <p>
            This is still the text editor you’re used to, but enriched with node views.
            </p>
            <TraceComponent count="0"/>
            <p>
            Did you see that? That’s a React component. We are really living in the future.
            </p>`,
    });

    // window.editor = editor;
    return { editor };
};
