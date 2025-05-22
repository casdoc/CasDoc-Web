import { Editor, EditorContent } from "@tiptap/react";
import { ContentItemMenu } from "../DragMenu/ContentItemMenu";
import "@/styles/index.css";
import { memo, useRef } from "react";
import LinkMenu from "@/app/components/Menus/LinkMenu";
import { Document } from "@/app/models/entity/Document";
interface BlockEditorProps {
    editor: Editor;
    selectedDocumentId: string | null;
    document: Document | undefined;
}

const BlockEditor = ({
    editor,
    selectedDocumentId,
    document,
}: BlockEditorProps) => {
    const menuContainerRef = useRef(null);
    const handleAddDefaultNode = () => {
        if (!editor) return;

        const { doc } = editor.state;
        const lastNode = doc.lastChild;

        // Check if the last node is already an empty paragraph
        const isEmptyParagraphAtEnd =
            lastNode &&
            lastNode.type.name === "paragraph" &&
            lastNode.textContent === "";

        if (isEmptyParagraphAtEnd) {
            // If there's already an empty paragraph at the end, just focus on it
            editor.commands.focus("end");
        } else {
            // Otherwise, add a new paragraph at the end and focus on it
            editor
                .chain()
                .insertContentAt(doc.content.size, "<p></p>")
                .focus("end")
                .run();
        }
    };
    if (!selectedDocumentId) {
        console.debug("selectedDocumentId is null");
        return null;
    }

    return (
        <div className="flex-1 overflow-y-auto" ref={menuContainerRef}>
            <EditorContent editor={editor} />
            <ContentItemMenu editor={editor} />
            <LinkMenu editor={editor} appendTo={menuContainerRef} />
            {/* Transparent clickable area to add default node */}
            <div
                className="w-full h-12 cursor-text"
                onClick={handleAddDefaultNode}
                aria-label="Click to continue writing"
            />
            <div className=" border-t-2 border-gray-200 bg-white h-16 px-4 mx-auto flex justify-end items-start pb-1 max-w-2xl">
                <span className="text-sm text-gray-400 font-medium py-1 truncate max-w-xs cursor-default">
                    {document?.title ?? "Untitled Document"}
                </span>
            </div>
        </div>
    );
};

export default memo(BlockEditor);
