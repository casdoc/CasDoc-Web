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
        // immediatelyRender: true,
        // shouldRerenderOnTransaction: false,
        // autofocus: true,
        // content: `<h1>This is a 1st level heading</h1>
        // <h2>This is a 2nd level heading</h2>
        // <h3>This is a 3rd level heading</h3>
        // <h4>This 4th level heading will be converted to a paragraph, because levels are configured to be only 1, 2 or 3.</h4`,
        // content: tmpData
        content: `
        <h1>Heading 1</h1>
        <p s>This is a paragraph.</p>
        <TraceComponent ></TraceComponent>`,
    });
    // window.editor = editor;
    return { editor };
};
