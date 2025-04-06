import { NodeViewWrapper } from "@tiptap/react";
import { NodeViewProps } from "@tiptap/core";
import MermaidEditor from "@/app/components/doc/Mermaid/MermaidEditor";
import { useNodeSelection } from "@/app/viewModels/context/NodeSelectionContext";
import { useRef, useState, useEffect } from "react";
import NodeBubbleBar from "@/app/components/doc/Popover/NodeBubbleBar";

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
    const isEditing = selectedNode === id;
    const isUpdatingRef = useRef(false);
    const [showBubbleBar, setShowBubbleBar] = useState(false);

    // Reset bubble bar when component loses selection
    useEffect(() => {
        if (!selected && showBubbleBar) {
            setShowBubbleBar(false);
        }
    }, [selected, showBubbleBar]);

    const handleContainerClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (window.getSelection()?.toString()) {
            return;
        }
        // Toggle the bubble bar visibility
        setShowBubbleBar(!showBubbleBar);
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
                isEditing
                    ? "border-blue-500 "
                    : selected
                    ? "border-gray-500 "
                    : "border-white hover:border-gray-200"
            } `}
            onClick={handleContainerClick}
        >
            <NodeBubbleBar
                id={id}
                selected={showBubbleBar}
                getPos={getPos}
                editor={editor}
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
