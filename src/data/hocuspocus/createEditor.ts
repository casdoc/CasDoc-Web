import { Editor } from "@tiptap/react";
import { createProvider } from "./createProvider";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import ExtensionKit from "@/extensions/ExtensionKit";
import { EditorSession } from "@/app/viewModels/useMultiEditor";

export const createEditor = async (
    documentId: string,
    token: string | null
): Promise<EditorSession | null> => {
    try {
        const provider = await createProvider(documentId, token);
        if (!provider) return null;

        const editor = new Editor({
            autofocus: true,
            extensions: [
                ...ExtensionKit(),
                Collaboration.configure({
                    document: provider.document,
                }),
                CollaborationCursor.configure({
                    provider,
                }),
            ],
            editorProps: {
                attributes: {
                    autocomplete: "off",
                    autocorrect: "off",
                    autocapitalize: "off",
                    spellcheck: "false",
                },
            },
        });

        return { editor, provider } as EditorSession;
    } catch (error) {
        console.error("Failed to create editor:", error);
        return null;
    }
};
