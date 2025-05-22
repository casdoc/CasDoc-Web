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
import { randomColor } from "@/lib/utils";
import { useCollabProviderContext } from "./CollabProviderContext";
import { Node } from "@tiptap/pm/model";

// Define the shape of the context
interface EditorViewModel {
    editor: Editor | null | undefined;
    isCollaborating: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    docContent: any | null;
    editorDoc: Node | null;
}

// Create the context with default values
const EditorContext = createContext<EditorViewModel | undefined>(undefined);

export const EditorProvider = ({ children }: { children: ReactNode }) => {
    // const [onlineUsers, setOnlineUsers] = useState<
    //     Array<{ clientId: number; user: any }>
    // >([]);
    // const [hocuspocusProvider, setHocuspocusProvider] =
    //     useState<HocuspocusProvider>();
    const { selectedDocumentId, selectedProjectId, selectDocument } =
        useProjectContext();
    const router = useRouter();
    const params = useParams();
    // Get the document ID from URL params or context
    const documentParam = params?.document as string | undefined;
    const documentId = documentParam || selectedDocumentId || "";
    if (documentId !== selectedDocumentId) {
        selectDocument(documentId);
    }
    // Initialize color for user cursor
    const [userColor] = useState(() => randomColor());
    const username = "Anonymous User";

    const { collabProvider } = useCollabProviderContext();
    useEffect(() => {
        if (selectedDocumentId && !documentParam && selectedProjectId) {
            router.push(`/document/${selectedDocumentId}`);
        }
    }, [selectedDocumentId, documentParam, router, selectedProjectId]);

    const { editor, editorDoc, docContent } = useBlockEditor({
        documentId: documentId,
        collaborationProvider: collabProvider,
        collaborationOptions: {
            user: {
                name: username,
                color: userColor,
            },
        },
    });
    // const editor = res?.editor;

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
        docContent,
        editorDoc,
        // currentStatus,
        isCollaborating: !!collabProvider,
        // onlineUsers,
    };

    return (
        <EditorContext.Provider value={value}>
            {editor ? children : <div>Connecting to editor...</div>}
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
