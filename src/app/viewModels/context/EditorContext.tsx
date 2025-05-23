import { Editor } from "@tiptap/react";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useBlockEditor } from "@/app/viewModels/useBlockEditor";
import { useProjectContext } from "./ProjectContext";
import { randomColor } from "@/lib/utils";
import { useCollabProviderContext } from "./CollabProviderContext";
import { Node } from "@tiptap/pm/model";

interface EditorViewModel {
    editor: Editor | null | undefined;
    isCollaborating: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    docContent: any | null;
    editorDoc: Node | null;
}

const EditorContext = createContext<EditorViewModel | undefined>(undefined);

export const EditorProvider = ({ children }: { children: ReactNode }) => {
    const { selectedDocumentId } = useProjectContext();

    const [userColor] = useState(() => randomColor());
    const username = "Anonymous User";

    const { collabProvider } = useCollabProviderContext();

    const { editor, editorDoc, docContent } = useBlockEditor({
        documentId: selectedDocumentId || undefined,
        collaborationProvider: collabProvider,
        collaborationOptions: {
            user: {
                name: username,
                color: userColor,
            },
        },
    });

    const value = {
        editor,
        docContent,
        editorDoc,
        isCollaborating: !!collabProvider,
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
