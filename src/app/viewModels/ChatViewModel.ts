import { useState } from "react";

interface AgentNode {
    id: string;
    title: string;
}

export interface ChatViewModel {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    componentChangeApply: (componentId: string, nodeJson: any) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    componentAddAI: (componentId: string, nodeJson: any) => void;
    addToAgentNodeIds: AgentNode[];
    addNodeToAgent: (nodeId: string, title: string) => void;
    removeNodeFromAgent: (nodeId: string) => void;
}

export const useChatViewModel = (): ChatViewModel => {
    const [isOpen, setIsOpen] = useState(false);
    const [addToAgentNodeIds, setAddToAgentNodeIds] = useState<AgentNode[]>([]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const componentChangeApply = (componentId: string, nodeJson: any) => {
        // Dispatch the event to update the component
        window.dispatchEvent(
            new CustomEvent("ai-apply-update-component", {
                detail: { componentId, nodeJson },
            })
        );
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const componentAddAI = (componentId: string, nodeJson: any) => {
        // Dispatch the event to add a new component after the target component
        window.dispatchEvent(
            new CustomEvent("ai-add-component", {
                detail: { componentId, nodeJson },
            })
        );
    };

    const addNodeToAgent = (nodeId: string, title: string) => {
        if (!addToAgentNodeIds.some((node) => node.id === nodeId)) {
            setAddToAgentNodeIds([...addToAgentNodeIds, { id: nodeId, title }]);
        }
    };

    const removeNodeFromAgent = (nodeId: string) => {
        setAddToAgentNodeIds(
            addToAgentNodeIds.filter((node) => node.id !== nodeId)
        );
    };

    return {
        isOpen,
        setIsOpen,
        componentChangeApply,
        componentAddAI,
        addToAgentNodeIds,
        addNodeToAgent,
        removeNodeFromAgent,
    };
};
