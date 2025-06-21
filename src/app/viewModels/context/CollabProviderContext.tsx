import {
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
import supabase from "@/lib/supabase";
import { Session, AuthError } from "@supabase/supabase-js";
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
    const [session, setSession] = useState<Session | null>(null);
    const [error, setError] = useState<AuthError | null>(null);

    // Fetch authentication session
    useEffect(() => {
        const getSession = async () => {
            const { data, error } = await supabase.auth.getSession();
            if (error) {
                setError(error);
            } else {
                setSession(data.session);
            }
        };

        getSession();
    }, []);

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
        const token = session?.access_token;
        const provider = new HocuspocusProvider({
            url: "ws://localhost:1234",
            name: selectedDocumentId,
            token: token,
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
    }, [selectedDocumentId, documentId, error, session]);

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
