import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface PreviewProps {
    content: string;
}

const Preview = ({ content }: PreviewProps) => {
    return (
        <div className="prose max-w-full min-h-screen p-16 rounded-lg bg-white shadow-xl overflow-auto">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default Preview;
