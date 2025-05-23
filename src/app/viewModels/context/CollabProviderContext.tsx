import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { useProjectContext } from "./ProjectContext";
import { useParams } from "next/navigation";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { set } from "lodash";

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
    const params = useParams();
    // Get the document ID from URL params or context
    const documentParam = params?.document as string | undefined;
    const documentId = documentParam || selectedDocumentId || "";

    useEffect(() => {
        if (!documentId) return;
        console.debug("Document ID:", documentId);
        const provider = new HocuspocusProvider({
            url: "ws://localhost:1234",
            name: documentId, //temp
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
            provider.detach();
        };
    }, [documentId]);
    console.debug("HocuspocusProvider:", hocuspocusProvider);
    // Only attach the provider if it exists

    if (!hocuspocusProvider || !isSynced) return <></>;

    hocuspocusProvider.attach();
    console.debug("HocuspocusProvider attached");
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
