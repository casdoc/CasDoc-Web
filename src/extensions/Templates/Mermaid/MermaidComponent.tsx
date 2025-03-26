import { NodeViewWrapper } from "@tiptap/react";
import { NodeViewProps } from "@tiptap/core";
import MermaidEditor from "@/app/components/doc/Mermaid/MermaidEditor";
import { useNodeSelection } from "@/app/viewModels/context/NodeSelectionContext";
import { useEffect, useRef } from "react";

const MermaidComponent: React.FC<NodeViewProps> = ({
    node,
    selected,
    updateAttributes,
}) => {
    const { id, config } = node.attrs;
    console.debug("MermaidComponent", config);
    const mermaidCode = config?.content || "";
    const { selectedNode, selectNode } = useNodeSelection();
    const isSelected = selectedNode === id;
    const isUpdatingRef = useRef(false);
    useEffect(() => {
        console.debug("Mermaid Component initialized", mermaidCode);
    }, [mermaidCode]);
    const handleClick = (e) => {
        if (e.target.closest(".mermaid-editor-container")) {
            e.stopPropagation();
            return;
        }
        console.debug("MermaidComponent handleClick");
        selectNode(isSelected ? null : id);
    };
    const handleCodeUpdate = (newCode: string) => {
        if (isUpdatingRef.current) return;

        isUpdatingRef.current = true;
        // 更新 Tiptap 節點屬性
        console.debug("MermaidComponent handleCodeUpdate", newCode);
        updateAttributes({
            config: {
                ...config,
                content: newCode,
            },
        });

        // 重置標誌
        setTimeout(() => {
            isUpdatingRef.current = false;
        }, 0);
    };

    return (
        <NodeViewWrapper
            className={`ml-8 cursor-pointer  rounded-lg pt-2 border-2 bg-white ${
                isSelected
                    ? "border-blue-500"
                    : selected
                    ? "border-gray-500"
                    : "border-white hover:border-gray-200"
            }`}
            onClick={handleClick}
        >
            <div className="h-full ">
                <MermaidEditor
                    initialCode={mermaidCode}
                    onCodeUpdate={handleCodeUpdate}
                />
            </div>
        </NodeViewWrapper>
    );
};

export default MermaidComponent;
