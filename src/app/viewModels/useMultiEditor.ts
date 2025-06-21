import { useRef, useEffect, useState, useCallback } from "react";
import { Editor } from "@tiptap/react";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { createEditor } from "@/data/hocuspocus/createEditor";
import { Document } from "@/app/models/entity/Document";
import authManager from "@/lib/authManager";
import { useQueryClient } from "@tanstack/react-query";
import { useProjectContext } from "./context/ProjectContext";

export type EditorSession = {
    editor: Editor;
    provider: HocuspocusProvider;
};

export interface MultiEditorViewModel {
    editorMap: Map<string, EditorSession>;
    activeEditor: Editor | null;
    isLoading: boolean;
}

export const useMultiEditor = (): MultiEditorViewModel => {
    const queryClient = useQueryClient();
    const accessToken = authManager.getAccessToken();
    const { selectedProjectId, selectedDocumentId } = useProjectContext();
    const editorMapRef = useRef<Map<string, EditorSession>>(new Map());
    const [activeEditor, setActiveEditor] = useState<Editor | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const cleanupEditors = useCallback(() => {
        editorMapRef.current.forEach((session) => {
            session.editor.destroy();
            session.provider.disconnect();
        });
        editorMapRef.current.clear();
    }, []);

    useEffect(() => {
        if (!selectedDocumentId || isLoading) {
            setActiveEditor(null);
            return;
        }

        const editorMap = editorMapRef.current;
        const editor = editorMap.get(selectedDocumentId)?.editor ?? null;
        setActiveEditor(editor);

        console.debug("Select DocumentId: ", selectedDocumentId);
        console.debug("Editor Map: ", editorMap);
        console.debug("Active Editor: ", editor);
    }, [selectedDocumentId, isLoading]);

    useEffect(() => {
        if (!selectedProjectId) {
            cleanupEditors();
            setActiveEditor(null);
            return;
        }

        const initializeEditors = async () => {
            setIsLoading(true);
            setActiveEditor(null);

            cleanupEditors();

            const documents =
                queryClient.getQueryData<Document[]>([
                    "documents",
                    selectedProjectId,
                ]) ?? [];

            if (documents.length === 0) {
                setIsLoading(false);
                return;
            }

            const newEditorMap = new Map<string, EditorSession>();

            const editorPromises = documents.map(async (doc) => {
                try {
                    const session = await createEditor(doc.id, accessToken);
                    console.debug("Session created for doc:", doc.id, session);
                    if (session) {
                        return { docId: doc.id, session };
                    }
                } catch (error) {
                    console.error(
                        `Failed to create editor for doc ${doc.id}:`,
                        error
                    );
                }
                return null;
            });

            try {
                const results = await Promise.all(editorPromises);

                results.forEach((result) => {
                    if (result) {
                        newEditorMap.set(result.docId, result.session);
                    }
                });

                console.debug("All editors initialized: ", newEditorMap);
                editorMapRef.current = newEditorMap;
            } catch (error) {
                console.error("Failed to initialize editors:", error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeEditors();
    }, [selectedProjectId, accessToken, cleanupEditors, queryClient]);

    useEffect(() => {
        return () => {
            cleanupEditors();
        };
    }, [cleanupEditors]);

    return {
        editorMap: editorMapRef.current,
        activeEditor,
        isLoading,
    };
};
