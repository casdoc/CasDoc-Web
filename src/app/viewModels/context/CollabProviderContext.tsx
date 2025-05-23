import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { useProjectContext } from "./ProjectContext";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { LoadingMask } from "@/app/document/components/LoadingMask";

// Define the shape of the context
interface CollabProviderViewModel {
    collabProvider: HocuspocusProvider;
}

// Create the context with default values
const CollabProviderContext = createContext<
    CollabProviderViewModel | undefined
>(undefined);

export const CollabProvider = ({ children }: { children: ReactNode }) => {
    const [hocuspocusProvider, setHocuspocusProvider] =
        useState<HocuspocusProvider>();
    const [isSynced, setIsSynced] = useState(false);
    const { selectedDocumentId } = useProjectContext();
    useEffect(() => {
        if (!selectedDocumentId) return;
        const provider = new HocuspocusProvider({
            url: "ws://localhost:1234",
            name: selectedDocumentId,
            onConnect: () => console.log("onConnect!"),
            onOpen: (data) => console.log("onOpen!", data),
            onClose: (data) => console.log("onClose!", data),
            onAuthenticated: (data) => console.log("onAuthenticated!", data),
            onAuthenticationFailed: (data) =>
                console.log("onAuthenticationFailed", data),
            onSynced: () => setIsSynced(true),
        });

        setHocuspocusProvider(provider);

        return () => {
            provider.destroy();
        };
    }, [selectedDocumentId]);

    if (!hocuspocusProvider?.isSynced || !isSynced || !selectedDocumentId)
        return <LoadingMask />;

    hocuspocusProvider.attach();

    const value = {
        collabProvider: hocuspocusProvider,
    };

    return (
        <CollabProviderContext.Provider value={value}>
            {children}
        </CollabProviderContext.Provider>
    );
};

// Custom hook for consuming the context
export const useCollabProviderContext = (): CollabProviderViewModel => {
    const context = useContext(CollabProviderContext);
    if (context === undefined) {
        throw new Error(
            "useCollabProviderContext must be used within a CollabProvider"
        );
    }

    return context;
};
