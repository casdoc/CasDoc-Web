import React from "react";
import { NodeViewWrapper } from "@tiptap/react";
import { NodeViewProps } from "@tiptap/core";

export const TopicComponent: React.FC<NodeViewProps> = ({ node }) => {
    const { name } = node.attrs;

    return (
        <NodeViewWrapper className="p-6 border rounded-lg shadow-md bg-white">
            <div className="mb-6 border-l-4 border-indigo-500 pl-4">
                <h2 className="text-2xl font-bold text-indigo-700">
                    {name || "Topic Name"}
                </h2>
            </div>
        </NodeViewWrapper>
    );
};
