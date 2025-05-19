import { Editor } from "@tiptap/react";
import { Node as ProsemirrorNode } from "prosemirror-model";
import React, {
    createContext,
    useContext,
    useState,
    useMemo,
    useEffect,
    ReactNode,
} from "react";
import { useBlockEditor } from "@/app/viewModels/useBlockEditor";
import SaveStatus from "@/app/models/enum/SaveStatus";
import { useProjectContext } from "./ProjectContext";
import { useParams, useRouter } from "next/navigation";
import { randomColor } from "@/lib/utils";
import { SocketContext } from "./SocketContext";
import { HocuspocusProvider } from "@hocuspocus/provider";
import * as Y from "yjs";
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
    const socket = useContext(SocketContext);
    const { selectedDocumentId, selectedProjectId } = useProjectContext();
    const router = useRouter();
    const params = useParams();
    // const { data: session } = useSession();

    // Get the document ID from URL params or context
    const documentParam = params?.document as string | undefined;
    const documentId = documentParam || selectedDocumentId || "";

    // Initialize color for user cursor
    // const [userColor] = useState(() => randomColor());
    // const username = "Anonymous User";

    useEffect(() => {
        if (!socket || !documentId) return;

        const provider = new HocuspocusProvider({
            websocketProvider: socket,
            name: documentId, //temp
            onOpen: (data) => console.log("onOpen!", data),
            onClose: (data) => console.log("onClose!", data),
            onAuthenticated: (data) => console.log("onAuthenticated!", data),
            onAuthenticationFailed: (data) =>
                console.log("onAuthenticationFailed", data),
            onUnsyncedChanges: (data) => console.log("onUnsyncedChanges", data),
        });

        setHocuspocusProvider(provider);
        const yDoc = provider.document.getArray;
        // if (yDoc) {
        //     // Make sure there's a default "default" XML Fragment
        //     if (!yDoc.getXmlFragment("default")) {
        //         // Create the default fragment
        //         const xmlFragment = new Y.XmlFragment();
        //         yDoc.getMap("documents").set("default", xmlFragment);
        //     }
        // }
        console.log("Provider initialized with document :", yDoc);
        return () => {
            provider.destroy();
        };
    }, [socket, documentId]);

    useEffect(() => {
        if (selectedDocumentId && !documentParam && selectedProjectId) {
            router.push(`/document/${selectedDocumentId}`);
        }
    }, [selectedDocumentId, documentParam, router, selectedProjectId]);

    const { editor } = useBlockEditor({
        documentId: hocuspocusProvider ? undefined : documentId, // Only use regular sync if no provider
        collaborationProvider: hocuspocusProvider,
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
