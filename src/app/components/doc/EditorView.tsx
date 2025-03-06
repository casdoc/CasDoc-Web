"use client";

import { BlockViewModel } from "@/app/viewModels/BlockViewModel";
import { useEditor, EditorContent } from "@tiptap/react";
import { ExtensionKit } from "@/extensions/ExtensionKit";
import tmpData from "./tmp.json";
export interface EditorViewProps {
    blockViewModel: BlockViewModel;
}
const EditorView = ({ blockViewModel }: EditorViewProps) => {
    const editor = useEditor({
        extensions: [...ExtensionKit()],
        editorProps: {
            attributes: {
                class: "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none",
            },
        },
        immediatelyRender: false,
        // shouldRerenderOnTransaction: false,
        // autofocus: true,
        // content: `<h1>This is a 1st level heading</h1>
        // <h2>This is a 2nd level heading</h2>
        // <h3>This is a 3rd level heading</h3>
        // <h4>This 4th level heading will be converted to a paragraph, because levels are configured to be only 1, 2 or 3.</h4`,
        content: tmpData,
    });

    if (!editor) {
        return null;
    }
    console.debug(editor.getJSON());
    return (
        <div className="max-w-4xl min-h-screen bg-white rounded-lg shadow-xl py-10 px-6">
            {/* <div className="relative flex flex-col flex-1 h-full overflow-hidden border-red-400 border-2"> */}
            <EditorContent editor={editor} />
            {/* </div> */}
        </div>
    );
};

export default EditorView;
