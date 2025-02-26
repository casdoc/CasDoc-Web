'use client';

import { useRef, useEffect } from "react";

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

const Editor = ({ value, onChange }: EditorProps) => {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = "auto";
            textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
        }
    }, [value]);

    return (
        <div className="max-w-full min-h-screen bg-white shadow-xl rounded-lg p-16">
            <textarea
                ref={textAreaRef}
                className="w-full min-h-screen outline-none text-lg leading-relaxed bg-transparent resize-none overflow-hidden"
                style={{ whiteSpace: "pre-wrap" }}
                placeholder="週休七日..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
};

export default Editor;