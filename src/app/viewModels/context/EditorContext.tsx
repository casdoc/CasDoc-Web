import React, { createContext, useContext, ReactNode } from "react";
import { Editor } from "@tiptap/react";
import SaveStatus from "@/app/models/enum/SaveStatus";
import { useBlockEditor } from "../useBlockEditor";

// Define the shape of the context
interface EditorContextType {
    editor: Editor | null;
    currentStatus: () => SaveStatus;
}

// Create the context with default values
const EditorContext = createContext<EditorContextType | undefined>(undefined);

interface EditorProviderProps {
    children: ReactNode;
    documentId?: string;
}

export const EditorProvider: React.FC<EditorProviderProps> = ({
    children,
    documentId,
}) => {
    // Use the block editor hook to get editor instance and status
    const { editor, currentStatus } = useBlockEditor({ documentId });

    // Create the value object to be provided to consumers
    const value = {
        editor,
        currentStatus,
    };

    return (
        <EditorContext.Provider value={value}>
            {children}
        </EditorContext.Provider>
    );
};

// Custom hook for consuming the context
export const useEditorContext = (): EditorContextType => {
    const context = useContext(EditorContext);

    if (context === undefined) {
        throw new Error(
            "useEditorContext must be used within an EditorProvider"
        );
    }

    return context;
};
