import { createContext, useContext, ReactNode } from "react";
import { GraphViewModel, useGraphViewModel } from "../GraphViewModel";

const GraphContext = createContext<GraphViewModel | undefined>(undefined);

export function GraphProvider({ children }: { children: ReactNode }) {
    const graphViewModel = useGraphViewModel();
    graphViewModel.initGraphNodes();
    return (
        <GraphContext.Provider value={graphViewModel}>
            {children}
        </GraphContext.Provider>
    );
}

export function useGraphContext(): GraphViewModel {
    const context = useContext(GraphContext);
    if (context === undefined) {
        throw new Error("useGraphContext must be used within a GraphProvider");
    }
    return context;
}
