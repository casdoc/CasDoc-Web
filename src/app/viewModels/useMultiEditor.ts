import { useRef, useState, useCallback } from "react";
import { Editor } from "@tiptap/react";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { createEditor } from "@/data/hocuspocus/createEditor";
import authManager from "@/lib/authManager";

export type EditorSession = {
    editor: Editor;
    provider: HocuspocusProvider;
};

export interface MultiEditorViewModel {
    activeId: string | null;
    openEditor: (documentId: string) => Promise<Editor | null>;
    setActiveEditor: (documentId: string) => void;
    editor: () => Editor | null;
    destroyAllEditors: () => void;
}

export const useMultiEditor = (): MultiEditorViewModel => {
    const accessToken = authManager.getAccessToken();

    const editorMap = useRef<Map<string, EditorSession>>(new Map());
    const [activeId, setActiveId] = useState<string | null>(null);

    const openEditor = useCallback(
        async (documentId: string) => {
            const session = editorMap.current.get(documentId);
            if (session) {
                return session.editor;
            }

            const newSession = await createEditor(documentId, accessToken);
            if (!newSession) return null;

            editorMap.current.set(documentId, newSession);
            return newSession.editor;
        },
        [accessToken]
    );

    const setActiveEditor = useCallback((documentId: string) => {
        setActiveId(documentId);
    }, []);

    const getActiveEditor = useCallback(() => {
        if (!activeId) return null;
        return editorMap.current.get(activeId)?.editor ?? null;
    }, [activeId]);

    const destroyAllEditors = useCallback(() => {
        editorMap.current.forEach((session) => {
            session.editor.destroy();
            session.provider.disconnect();
        });
        editorMap.current.clear();
        setActiveId(null);
    }, []);

    return {
        activeId,
        openEditor,
        setActiveEditor,
        editor: getActiveEditor,
        destroyAllEditors,
    };
};
