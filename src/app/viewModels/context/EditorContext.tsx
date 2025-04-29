import React, { createContext, useContext, ReactNode } from "react";
import { Editor } from "@tiptap/react";
import SaveStatus from "@/app/models/enum/SaveStatus";
import { useBlockEditor } from "../useBlockEditor";
import { Node as ProsemirrorNode } from "prosemirror-model";
import { useProjectContext } from "./ProjectContext";

// Define the shape of the context
interface EditorViewModel {
    docContent:
        | {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              allContent: Record<string, any>[];
              documentId: string;
          }
        | undefined;
    editorDoc: ProsemirrorNode | undefined;
    editor: Editor | null;
    currentStatus: () => SaveStatus;
}

// Create the context with default values
const EditorContext = createContext<EditorViewModel | undefined>(undefined);

export const EditorProvider = ({ children }: { children: ReactNode }) => {
    const { selectedDocumentId: documentId } = useProjectContext();
    // Use the block editor hook to get editor instance and status
    const blockEditorViewModel = useBlockEditor({
        documentId: documentId || "",
    });

    return (
        <EditorContext.Provider value={blockEditorViewModel}>
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
