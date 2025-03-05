"use client";

import { BlockViewModel } from "@/app/viewModels/BlockViewModel";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export interface EditorViewProps {
    blockViewModel: BlockViewModel;
}

const EditorView = ({ blockViewModel }: EditorViewProps) => {
    const editor = useEditor({
        extensions: [StarterKit],
        content: "<p>Hello World! 🌎️</p>",
    });
    return (
        <div className="max-w-4xl min-h-screen bg-white rounded-lg shadow-xl py-10 px-6">
            <EditorContent editor={editor} />
        </div>
    );
};

export default EditorView;
