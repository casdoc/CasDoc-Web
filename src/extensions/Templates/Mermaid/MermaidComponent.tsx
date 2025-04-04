import { NodeViewWrapper } from "@tiptap/react";
import { NodeViewProps } from "@tiptap/core";
import MermaidEditor from "@/app/components/doc/Mermaid/MermaidEditor";
import { useNodeSelection } from "@/app/viewModels/context/NodeSelectionContext";
import { useCallback, useEffect, useRef, useState } from "react";
import NodeBubbleBar from "@/app/components/doc/Popover/NodeBubbleBar";

const MermaidComponent: React.FC<NodeViewProps> = ({
    node,
    selected,
    editor,
    updateAttributes,
    getPos,
}) => {
    const { id, config } = node.attrs;
    const mermaidCode = config?.content || "";
    const name = config?.info?.name || "Mermaid";
    const { selectedNode } = useNodeSelection();
    const isSelected = selectedNode === id;
    const isUpdatingRef = useRef(false);
    const [bubbleOpen, setBubbleOpen] = useState(false);

    const handleEdit = useCallback(() => {
        const event = new CustomEvent("global-node-select", {
            detail: { id },
        });
        window.dispatchEvent(event);
    }, [id]);
    // Add a direct keyboard event handler
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Check if this is Ctrl+Enter (or Cmd+Enter on Mac)
            const isMod = e.ctrlKey || e.metaKey;
            if (isMod && e.key === "Enter") {
                // Only handle if this node is selected
                if (selected) {
                    handleEdit();
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        };
        if (!selected) document.removeEventListener("keydown", handleKeyDown);
        else document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleEdit, id, selected]);

    const handleCopy = () => {
        if (typeof getPos === "function") {
            const pos = getPos();
            editor.commands.setNodeSelection(pos);

            const event = new CustomEvent("node-copy", {
                detail: { pos },
            });
            window.dispatchEvent(event);
        }
    };

    const handleDelete = () => {
        if (typeof getPos === "function") {
            const pos = getPos();

            const event = new CustomEvent("node-delete", {
                detail: { id, pos },
            });
            window.dispatchEvent(event);
        }
    };
    const handleContainerClick = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            if (
                (e.nativeEvent as MouseEvent & { __handledByEditor?: boolean })
                    .__handledByEditor
            )
                return;
            setBubbleOpen(!bubbleOpen);
        },
        [bubbleOpen]
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
            className={`ml-8 cursor-pointer  rounded-lg border-2 relative bg-white ${
                isSelected
                    ? "border-blue-500"
                    : selected
                    ? "border-gray-500"
                    : "border-white hover:border-gray-200"
            } ${selected ? "select-none" : ""}`}
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
