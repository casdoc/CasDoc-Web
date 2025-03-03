// components/ComponentRenderer.tsx
import Image from "next/image";
import React from "react";
import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { materialLight } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface ComponentRendererProps {
    type: string;
    content: string;
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({
    type,
    content,
}) => {
    // 處理JSX元件類型
    switch (type) {
        case "callout":
            return (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <div className="text-blue-700">{content}</div>
                </div>
            );

        case "divider":
            return <hr className="my-4" />;

        case "code":
            const language = content.split("\n")[0]?.trim() || "text";
            const codeContent = content.split("\n").slice(1).join("\n");

            return (
                <div className="rounded-md overflow-hidden">
                    <div className="bg-gray-200 px-4 py-1 text-sm">
                        {language}
                    </div>
                    <SyntaxHighlighter
                        language={language}
                        style={materialLight}
                        className="text-sm"
                    >
                        {codeContent}
                    </SyntaxHighlighter>
                </div>
            );

        case "image":
            try {
                const { src, alt, caption } = JSON.parse(content);
                return (
                    <figure className="my-4">
                        <Image
                            src={src}
                            alt={alt || "Image"}
                            className="max-w-full rounded"
                        />
                        {caption && (
                            <figcaption className="text-center text-sm text-gray-500 mt-2">
                                {caption}
                            </figcaption>
                        )}
                    </figure>
                );
            } catch (e) {
                return <div className="text-red-500">Invalid image data</div>;
            }

        // 其他JSX元件類型都使用ReactMarkdown處理
        default:
            return (
                <div className="prose prose-sm max-w-none">
                    <ReactMarkdown>{content}</ReactMarkdown>
                </div>
            );
    }
};
