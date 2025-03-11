import { createContext, useContext, useState } from "react";

interface NodeSelectionContextType {
    selectedNode: number | null;
    selectNode: (id: number | null) => void;
}

const NodeSelectionContext = createContext<
    NodeSelectionContextType | undefined
>(undefined);

export const NodeSelectionProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [selectedNode, setSelectedNode] = useState<number | null>(null);

    const selectNode = (id: number | null) => {
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
