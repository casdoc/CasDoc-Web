import { createContext, useContext, useState } from "react";

interface NodeSelectionContextType {
    selectedNode: string | null;
    selectNode: (id: string | null) => void;
    showTarget: boolean;
    toggleShowTarget: () => void;
    showSource: boolean;
    toggleShowSource: () => void;
}

const defaultContext: NodeSelectionContextType = {
    selectedNode: null,
    selectNode: () => {},
    showTarget: false,
    toggleShowTarget: () => {},
    showSource: false,
    toggleShowSource: () => {},
};

const NodeSelectionContext =
    createContext<NodeSelectionContextType>(defaultContext);

export const NodeSelectionProvider = ({
    children,
}: {
    children: React.ReactNode;
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

export const useNodeSelection = () => {
    const context = useContext(NodeSelectionContext);
    if (!context) {
        throw new Error(
            "useNodeSelection must be used within a NodeSelectionProvider"
        );
    }
    return context;
};
