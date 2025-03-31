import { NodeViewWrapper } from "@tiptap/react";
import { NodeViewProps } from "@tiptap/core";
import MermaidEditor from "@/app/components/doc/Mermaid/MermaidEditor";
import { useNodeSelection } from "@/app/viewModels/context/NodeSelectionContext";
import { useCallback, useRef } from "react";

const MermaidComponent: React.FC<NodeViewProps> = ({
    node,
    selected,
    updateAttributes,
}) => {
    const { id, config } = node.attrs;
    const mermaidCode = config?.content || "";
    const name = config?.info?.name || "Mermaid";
    const { selectedNode, selectNode } = useNodeSelection();
    const isSelected = selectedNode === id;
    const isUpdatingRef = useRef(false);

    const handleContainerClick = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            if (
                (e.nativeEvent as MouseEvent & { __handledByEditor?: boolean })
                    .__handledByEditor
            )
                return;
            selectNode(isSelected ? null : id);
        },
        [id, isSelected, selectNode]
    );

    const handleCodeUpdate = (newCode: string) => {
        if (isUpdatingRef.current) return;

        isUpdatingRef.current = true;

        updateAttributes({
            config: {
                ...config,
                content: newCode,
            },
        });

        setTimeout(() => {
            isUpdatingRef.current = false;
        }, 0);
    };

    return (
        <NodeViewWrapper
            className={`ml-8 cursor-pointer  rounded-lg border-2 bg-white ${
                isSelected
                    ? "border-blue-500"
                    : selected
                    ? "border-gray-500"
                    : "border-white hover:border-gray-200"
            }`}
            onClick={handleContainerClick}
        >
            <div className="h-full ">
                <MermaidEditor
                    name={name}
                    initialCode={mermaidCode}
                    onCodeUpdate={handleCodeUpdate}
                />
            </div>
        </NodeViewWrapper>
    );
};

export default MermaidComponent;
