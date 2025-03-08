import { useBlockEditor } from "@/hooks/useBlockEditor";
import { EditorContent } from "@tiptap/react";
import "@/styles/index.css";
import { ContentItemMenu } from "../DragMenu/ContentItemMenu";
export const BlockEditor = () => {
    const { editor } = useBlockEditor({});
    if (!editor) {
        return null;
    }
    console.debug(editor?.getJSON());
    return (
        <div className="max-w-4xl min-h-screen bg-white rounded-lg shadow-xl py-10 px-6">
            {/* <div className="relative flex flex-col flex-1 h-full overflow-hidden border-red-400 border-2"> */}
            <EditorContent editor={editor} />
            <ContentItemMenu editor={editor} />
            {/* </div> */}
        </div>
    );
};
