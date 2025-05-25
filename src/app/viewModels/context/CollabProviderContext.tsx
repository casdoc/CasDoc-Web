import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { useProjectContext } from "./ProjectContext";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { LoadingMask } from "@/app/documents/components/LoadingMask";

interface CollabProviderViewModel {
    collabProvider: HocuspocusProvider;
    status: CollaborationStatus;
}

const CollabProviderContext = createContext<
    CollabProviderViewModel | undefined
>(undefined);
export enum CollaborationStatus {
    Connected = "connected",
    Connecting = "connecting",
    Disconnected = "disconnected",
    Synced = "synced",
    UnsyncedChanges = "unsynced_changes",
    Error = "error",
}
export const CollabProvider = ({ children }: { children: ReactNode }) => {
    const [hocuspocusProvider, setHocuspocusProvider] =
        useState<HocuspocusProvider>();
    const [isSynced, setIsSynced] = useState(false);
    const { selectedDocumentId } = useProjectContext();
    const [status, setStatus] = useState<CollaborationStatus>(
        CollaborationStatus.Disconnected
    );
    useEffect(() => {
        if (!selectedDocumentId) return;
        const provider = new HocuspocusProvider({
            url: "ws://localhost:1234",
            name: selectedDocumentId,
            onConnect: () => {
                setStatus(CollaborationStatus.Connecting);
            },
            onDisconnect: () => {
                setStatus(CollaborationStatus.Disconnected);
            },
            onAuthenticationFailed: () => {
                setStatus(CollaborationStatus.Error);
            },
            onSynced: () => {
                setIsSynced(true);
                setStatus(CollaborationStatus.Synced);
            },
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
        status,
    };

    return (
        <CollabProviderContext.Provider value={value}>
            {children}
        </CollabProviderContext.Provider>
    );
};

export const useCollabProviderContext = (): CollabProviderViewModel => {
    const context = useContext(CollabProviderContext);
    if (context === undefined) {
        throw new Error(
            "useCollabProviderContext must be used within a CollabProvider"
        );
    }

    return context;
};
