import { useCallback, useEffect } from "react";
import { Editor } from "@tiptap/core";
type UseCustomNodeActionsParams = {
    id: string;
    selected: boolean;
    getPos: (() => number) | undefined;
    editor: Editor;
};

const useCustomNodeActions = ({
    id,
    selected,
    getPos,
    editor,
}: UseCustomNodeActionsParams) => {
    const handleEdit = useCallback(() => {
        const event = new CustomEvent("global-node-select", { detail: { id } });
        window.dispatchEvent(event);
    }, [id]);

    // Add keyboard listener for Ctrl+Enter/Cmd+Enter when selected
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const isMod = e.ctrlKey || e.metaKey;
            if (isMod && e.key === "Enter" && selected) {
                handleEdit();
                e.preventDefault();
                e.stopPropagation();
            }
        };
        if (selected) {
            document.addEventListener("keydown", handleKeyDown);
        } else {
            document.removeEventListener("keydown", handleKeyDown);
        }
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleEdit, selected]);

    const handleCopy = useCallback(() => {
        if (typeof getPos === "function") {
            const pos = getPos();
            editor.commands.setNodeSelection(pos);
            const event = new CustomEvent("node-copy", { detail: { pos } });
            window.dispatchEvent(event);
        }
    }, [getPos, editor]);

    const handleDelete = useCallback(() => {
        if (typeof getPos === "function") {
            const pos = getPos();
            const event = new CustomEvent("node-delete", {
                detail: { id, pos },
            });
            window.dispatchEvent(event);
        }
    }, [id, getPos]);

    return { handleEdit, handleCopy, handleDelete };
};

export default useCustomNodeActions;
