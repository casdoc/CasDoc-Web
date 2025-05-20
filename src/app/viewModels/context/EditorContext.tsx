import { Editor } from "@tiptap/react";
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { useBlockEditor } from "@/app/viewModels/useBlockEditor";
import { useProjectContext } from "./ProjectContext";
import { useParams, useRouter } from "next/navigation";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { randomColor } from "@/lib/utils";

// Define the shape of the context
interface EditorViewModel {
    editor: Editor | null;
    // currentStatus: SaveStatus;
    isCollaborating: boolean;
    // onlineUsers: Array<{ clientId: number; user: any }>;

    // docContent:
    //     | {
    //           // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //           allContent: Record<string, any>[];
    //           documentId: string;
    //       }
    //     | undefined;
    // editorDoc: ProsemirrorNode | undefined;
}

// Create the context with default values
const EditorContext = createContext<EditorViewModel | undefined>(undefined);

export const EditorProvider = ({ children }: { children: ReactNode }) => {
    // const [onlineUsers, setOnlineUsers] = useState<
    //     Array<{ clientId: number; user: any }>
    // >([]);
    const [hocuspocusProvider, setHocuspocusProvider] =
        useState<HocuspocusProvider>();
    const { selectedDocumentId, selectedProjectId } = useProjectContext();
    const router = useRouter();
    const params = useParams();
    // const { data: session } = useSession();

    // Get the document ID from URL params or context
    const documentParam = params?.document as string | undefined;
    const documentId = documentParam || selectedDocumentId || "";

    // Initialize color for user cursor
    const [userColor] = useState(() => randomColor());
    const username = "Anonymous User";

    useEffect(() => {
        if (!documentId) return;

        const provider = new HocuspocusProvider({
            url: "ws://localhost:1234",
            name: documentId, //temp
            onConnect: () => console.log("onConnect!"),
            onOpen: (data) => console.log("onOpen!", data),
            onClose: (data) => console.log("onClose!", data),
            onAuthenticated: (data) => console.log("onAuthenticated!", data),
            onAuthenticationFailed: (data) =>
                console.log("onAuthenticationFailed", data),
            onUnsyncedChanges: (data) => console.log("onUnsyncedChanges", data),
        });

        setHocuspocusProvider(provider);

        return () => {
            provider.destroy();
        };
    }, [documentId]);

    useEffect(() => {
        if (selectedDocumentId && !documentParam && selectedProjectId) {
            router.push(`/document/${selectedDocumentId}`);
        }
    }, [selectedDocumentId, documentParam, router, selectedProjectId]);

    const { editor } = useBlockEditor({
        documentId: hocuspocusProvider ? undefined : documentId, // Only use regular sync if no provider
        collaborationProvider: hocuspocusProvider,
        collaborationOptions: {
            user: {
                name: username,
                color: userColor,
            },
        },
    });

    if (!hocuspocusProvider) {
        return <></>;
    }
    hocuspocusProvider.attach();

    // Get current status based on provider state
    // const collaborationStatus = useMemo(() => {
    //     if (!isConnected) return SaveStatus.Connecting;
    //     if (!isSynced) return SaveStatus.Connecting;
    //     return SaveStatus.Saved;
    // }, [isConnected, isSynced]);

    // Set up editor with Hocuspocus integration or fallback to regular editor

    // Update user awareness when user info changes
    // useEffect(() => {
    //     if (provider && username) {
    //         provider.setAwarenessField("user", {
    //             name: username,
    //             color: userColor,
    //         });
    //     }
    // }, [provider, username, userColor]);

    // Sync URL with document ID

    // Combined status - use collaboration status when available, otherwise use regular status
    // const currentStatus = hocuspocusProvider ? collaborationStatus : regularStatus;

    const value = {
        editor,
        // currentStatus,
        isCollaborating: !!hocuspocusProvider,
        // onlineUsers,
    };

    return (
        <EditorContext.Provider value={value}>
            {children}
        </EditorContext.Provider>
    );
};

// Custom hook for consuming the context
export const useEditorContext = (): EditorViewModel => {
    const context = useContext(EditorContext);
    if (context === undefined) {
        throw new Error(
            "useEditorContext must be used within an EditorProvider"
        );
    }

    return context;
};
