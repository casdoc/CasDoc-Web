import { Editor, EditorContent } from "@tiptap/react";
import "@/styles/index.css";
import { ContentItemMenu } from "../DragMenu/ContentItemMenu";
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
