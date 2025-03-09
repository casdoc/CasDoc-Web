import { Editor, EditorContent } from "@tiptap/react";
import { ContentItemMenu } from "../DragMenu/ContentItemMenu";
import "@/styles/index.css";
interface BlockEditorProps {
    editor: Editor;
}
export const BlockEditor = ({ editor }: BlockEditorProps) => {
    return (
        <div className="flex-1 overflow-y-auto">
            <EditorContent editor={editor} />
            <ContentItemMenu editor={editor} />
        </div>
    );
};
