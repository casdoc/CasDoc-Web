import { Editor } from "@tiptap/react";
import React, { createContext, useContext, ReactNode } from "react";
import { useBlockEditor } from "@/app/viewModels/useBlockEditor";
import { useProjectContext } from "./ProjectContext";
import { useCollabProviderContext } from "./CollabProviderContext";
import { Node } from "@tiptap/pm/model";

interface EditorViewModel {
    editor: Editor | null | undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    docContent: any | null;
    editorDoc: Node | null;
}

const EditorContext = createContext<EditorViewModel | undefined>(undefined);

export const EditorProvider = ({ children }: { children: ReactNode }) => {
    const { selectedDocumentId } = useProjectContext();
    const { collabProvider } = useCollabProviderContext();
    const { editor, editorDoc, docContent } = useBlockEditor({
        documentId: selectedDocumentId || undefined,
        collaborationProvider: collabProvider,
    });
    const value = {
        editor,
        docContent,
        editorDoc,
    };
    return (
        <EditorContext.Provider value={value}>
            {editor ? children : <div>Connecting to editor...</div>}
        </EditorContext.Provider>
    );
};

export const useEditorContext = (): EditorViewModel => {
    const context = useContext(EditorContext);
    if (context === undefined) {
        throw new Error(
            "useEditorContext must be used within an EditorProvider"
        );
    }

    return context;
};
