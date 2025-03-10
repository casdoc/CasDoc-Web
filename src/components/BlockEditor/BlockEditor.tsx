"use client";
import { Editor, EditorContent } from "@tiptap/react";
import { ContentItemMenu } from "../DragMenu/ContentItemMenu";
import "@/styles/index.css";
import { useEffect, useState } from "react";
interface BlockEditorProps {
    editor: Editor;
}
export const BlockEditor = ({ editor }: BlockEditorProps) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted) {
        return <div className="flex-1 overflow-y-auto">Loading editor...</div>;
    }
    return (
        <div className="flex-1 overflow-y-auto">
            <EditorContent editor={editor} />
            <ContentItemMenu editor={editor} />
        </div>
    );
};
