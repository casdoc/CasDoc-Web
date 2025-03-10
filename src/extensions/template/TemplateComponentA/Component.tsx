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
            <label contentEditable={false}>Template A</label>
            <div className="bg-blue-400">
                <button onClick={increase}>
                    Parent --{">"} {node.attrs.parent}
                </button>
            </div>
        </NodeViewWrapper>
    );
};
