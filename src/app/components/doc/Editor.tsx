"use client";

// import { useRef, useEffect } from "react";

// interface EditorProps {
//     value: string;
//     onChange: (value: string) => void;
// }

// const Editor = ({ value, onChange }: EditorProps) => {
//     const textAreaRef = useRef<HTMLTextAreaElement>(null);

//     useEffect(() => {
//         if (textAreaRef.current) {
//             textAreaRef.current.style.height = "auto";
//             textAreaRef.current.style.height =
//                 textAreaRef.current.scrollHeight + "px";
//         }
//     }, [value]);

//     return (
//         <div className="max-w-full min-h-screen bg-white shadow-xl rounded-lg p-16">
//             <textarea
//                 ref={textAreaRef}
//                 className="w-full min-h-screen outline-none text-lg leading-relaxed bg-transparent resize-none overflow-hidden"
//                 style={{ whiteSpace: "pre-wrap" }}
//                 placeholder="週休七日..."
//                 value={value}
//                 onChange={(e) => onChange(e.target.value)}
//             />
//         </div>
//     );
// };

// export default Editor;
import React, { useCallback, useEffect, useRef } from "react";
import { useEditorStore } from "../../store/editorStore";
import { Block } from "./Block";
import { BlockView } from "@/app/components/editorPanel/BlockView";
import { useEditorViewModel } from "@/app/viewModels/editor/EditorViewModel";
export const Editor: React.FC = () => {
    // const blocks = useEditorStore((state) => state.blocks);
    const { blocks, addBlock, toggleBlockEditing } = useEditorViewModel();
    const lastBlockRef = useRef<HTMLDivElement>(null);

    // 當blocks數組變化時，如果只有一個空塊，則讓它獲得焦點
    useEffect(() => {
        // console.debug("blocks", blocks);
        // console.debug("blocks.length", blocks.length);
        // if (!blocks.length) {
        //     addBlock(-1, "md", "");
        // toggleBlockEditing(0);
        // }
        //  else if (blocks.length === 1 && blocks[0].content === "") {
        //     toggleBlockEditing(0);
        // const blockElement = lastBlockRef.current.querySelector(
        //     "[contenteditable=true]"
        // );
        // if (blockElement) {
        //     (blockElement as HTMLElement).focus();
        // }
        // }
    }, [blocks, addBlock, toggleBlockEditing]);

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div ref={lastBlockRef}>
                {blocks.map((block, _index) => (
                    <BlockView key={_index} block={block} />
                ))}
            </div>
        </div>
    );
};
