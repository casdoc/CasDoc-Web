import { createContext, useContext, useState } from "react";

interface NodeSelectionContextType {
    selectedNode: string | null;
    selectNode: (id: string | null) => void;
}

const NodeSelectionContext = createContext<
    NodeSelectionContextType | undefined
>(undefined);

export const NodeSelectionProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [selectedNode, setSelectedNode] = useState<string | null>(null);

    const selectNode = (id: string | null) => {
        setSelectedNode(id);
    };

    return (
        <NodeSelectionContext.Provider value={{ selectedNode, selectNode }}>
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
