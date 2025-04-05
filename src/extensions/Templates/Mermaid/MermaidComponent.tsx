import { NodeViewWrapper } from "@tiptap/react";
import { NodeViewProps } from "@tiptap/core";
import MermaidEditor from "@/app/components/doc/Mermaid/MermaidEditor";
import { useNodeSelection } from "@/app/viewModels/context/NodeSelectionContext";
import { useRef, useState } from "react";
import NodeBubbleBar from "@/app/components/doc/Popover/NodeBubbleBar";
import useCustomNodeActions from "@/extensions/hooks/useCustomNodeActions";

const MermaidComponent = ({
    node,
    selected,
    editor,
    updateAttributes,
    getPos,
}: NodeViewProps) => {
    const { id, config } = node.attrs;
    const mermaidCode = config?.content || "";
    const name = config?.info?.name || "Mermaid";
    const { selectedNode } = useNodeSelection();
    const isSelected = selectedNode === id;
    const isUpdatingRef = useRef(false);
    const [bubbleOpen, setBubbleOpen] = useState(false);

    const { handleEdit, handleCopy, handleDelete } = useCustomNodeActions({
        id,
        selected,
        getPos,
        editor,
    });

    const handleContainerClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (window.getSelection()?.toString()) {
            return;
        }

        setBubbleOpen(!bubbleOpen);
        if (
            (e.nativeEvent as MouseEvent & { __handledByEditor?: boolean })
                .__handledByEditor
        )
            return;
    };

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
            className={`ml-8 cursor-pointer  rounded-lg border-2 relative bg-white select-none  ${
                isSelected
                    ? "border-blue-500 "
                    : selected
                    ? "border-gray-500 "
                    : "border-white hover:border-gray-200"
            } `}
            onClick={handleContainerClick}
        >
            <NodeBubbleBar
                open={bubbleOpen}
                onOpenChange={setBubbleOpen}
                onCopy={handleCopy}
                onDelete={handleDelete}
                onEdit={handleEdit}
            />
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
