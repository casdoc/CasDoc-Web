import { Editor, EditorContent } from "@tiptap/react";
import { ContentItemMenu } from "../DragMenu/ContentItemMenu";
import "@/styles/index.css";
import { useRef } from "react";
import LinkMenu from "@/app/components/Menus/LinkMenu";

interface BlockEditorProps {
    editor: Editor;
    title: string;
}

export const BlockEditor = ({ editor, title }: BlockEditorProps) => {
    const menuContainerRef = useRef(null);
    return (
        <div className="flex-1 overflow-y-auto" ref={menuContainerRef}>
            <EditorContent editor={editor} />
            <ContentItemMenu editor={editor} />
            <LinkMenu editor={editor} appendTo={menuContainerRef} />
            <div className="border-t-2 border-gray-200 bg-white h-16 px-4 mx-10 flex justify-end items-start pb-1">
                <span className="text-sm text-gray-400 font-medium py-1">
                    {title}
                </span>
            </div>
        </div>
    );
};
