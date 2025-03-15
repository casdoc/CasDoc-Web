import { Editor, EditorContent } from "@tiptap/react";
import { ContentItemMenu } from "../DragMenu/ContentItemMenu";
import "@/styles/index.css";
import { useRef } from "react";
import LinkMenu from "@/app/components/Menus/LinkMenu";

interface BlockEditorProps {
    editor: Editor;
}

export const BlockEditor = ({ editor }: BlockEditorProps) => {
    const menuContainerRef = useRef(null);
    return (
        <div className="flex-1 overflow-y-auto" ref={menuContainerRef}>
            <EditorContent editor={editor} />
            <ContentItemMenu editor={editor} />
            <LinkMenu editor={editor} appendTo={menuContainerRef} />
        </div>
    );
};
