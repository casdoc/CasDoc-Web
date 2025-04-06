import { useState } from "react";

export interface ChatViewModel {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    componentChangeAply: (componentId: string, nodeJson: any) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    componentAddAI: (componentId: string, nodeJson: any) => void;
}

export const useChatViewModel = (): ChatViewModel => {
    const [isOpen, setIsOpen] = useState(false);

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

    return {
        isOpen,
        setIsOpen,
        componentChangeAply,
        componentAddAI,
    };
};
