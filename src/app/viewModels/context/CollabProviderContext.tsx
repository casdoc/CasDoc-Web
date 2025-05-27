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
import { useParams } from "next/navigation";

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
    const { selectedDocumentId, selectDocument } = useProjectContext();
    const [status, setStatus] = useState<CollaborationStatus>(
        CollaborationStatus.Disconnected
    );
    const { documentId } = useParams();

    // Watch for URL documentId changes and sync with selectedDocumentId
    useEffect(() => {
        if (documentId && documentId !== selectedDocumentId) {
            selectDocument(documentId as string);
        }
    }, [documentId, selectedDocumentId, selectDocument]);

    useEffect(() => {
        // Prevent provider creation if selectedDocumentId doesn't match URL documentId
        if (
            !selectedDocumentId ||
            !documentId ||
            selectedDocumentId !== documentId
        )
            return;

        console.debug(
            "Creating HocuspocusProvider for document:",
            selectedDocumentId
        );
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
    }, [selectedDocumentId, documentId]);

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
