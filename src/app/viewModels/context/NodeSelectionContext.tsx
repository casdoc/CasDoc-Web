import React, { createContext, useContext, useState, useEffect } from "react";

// Context for managing node selection state
interface NodeSelectionContextType {
    selectedNode: string | null;
    selectNode: (id: string | null) => void;
    showTarget: boolean;
    toggleShowTarget: () => void;
    showSource: boolean;
    toggleShowSource: () => void;
}

const NodeSelectionContext = createContext<NodeSelectionContextType>({
    selectedNode: null,
    selectNode: () => {},
    showTarget: false,
    toggleShowTarget: () => {},
    showSource: false,
    toggleShowSource: () => {},
});

export const NodeSelectionProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [selectedNode, setSelectedNode] = useState<string | null>(null);
    const [showTarget, setShowTarget] = useState(false);
    const [showSource, setShowSource] = useState(false);

    const toggleShowTarget = () => {
        setShowTarget(!showTarget);
    };

    const toggleShowSource = () => {
        setShowSource(!showSource);
    };

    const selectNode = (id: string | null) => {
        setSelectedNode(id);
    };

    // Listen for global node selection events
    useEffect(() => {
        const handleGlobalNodeSelection = (event: Event) => {
            const customEvent = event as CustomEvent;
            const { id } = customEvent.detail;
            selectNode(id);
        };

        window.addEventListener(
            "global-node-select",
            handleGlobalNodeSelection
        );

        return () => {
            window.removeEventListener(
                "global-node-select",
                handleGlobalNodeSelection
            );
        };
    }, []);

    return (
        <NodeSelectionContext.Provider
            value={{
                selectedNode,
                selectNode,
                showTarget,
                toggleShowTarget,
                showSource,
                toggleShowSource,
            }}
        >
            {children}
        </NodeSelectionContext.Provider>
    );
};

export const useNodeSelection = () => useContext(NodeSelectionContext);
