import { createContext, useContext, ReactNode } from "react";
import { GraphViewModel, useGraphViewModel } from "../GraphViewModel";

const GraphContext = createContext<GraphViewModel | undefined>(undefined);

export function GraphProvider({ children }: { children: ReactNode }) {
    const documentViewModel = useGraphViewModel();
    documentViewModel.initGraphNodes();
    return (
        <GraphContext.Provider value={documentViewModel}>
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
