import { NodeViewWrapper } from "@tiptap/react";
import { NodeViewProps } from "@tiptap/core";
import React from "react";
export const Component: React.FC<NodeViewProps> = ({
    node,
    updateAttributes,
}) => {
    const increase = () => {
        updateAttributes({
            count: node.attrs.count + 1,
        });
    };

    return (
        <NodeViewWrapper>
            <label contentEditable={false}>Component</label>
            <div className="bg-blue-700">
                <button onClick={increase}>
                    This button has been clicked {node.attrs.count} times.
                </button>
            </div>
        </NodeViewWrapper>
    );
};
