import { createContext, useContext, useState } from "react";
import { GraphViewModel } from "@/app/viewModels/GraphViewModel";

interface NodeSelectionContextType {
    selectedNode: string | null;
    selectNode: (id: string | null) => void;
    graphViewModel: GraphViewModel;
}

const defaultContext: NodeSelectionContextType = {
    selectedNode: null,
    selectNode: () => {},
    graphViewModel: {} as GraphViewModel,
};

const NodeSelectionContext =
    createContext<NodeSelectionContextType>(defaultContext);

export const NodeSelectionProvider = ({
    children,
    graphViewModel,
}: {
    children: React.ReactNode;
    graphViewModel: GraphViewModel;
}) => {
    const [selectedNode, setSelectedNode] = useState<string | null>(null);

    const selectNode = (id: string | null) => {
        setSelectedNode(id);
    };

    return (
        <NodeSelectionContext.Provider
            value={{ selectedNode, selectNode, graphViewModel }}
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
