import { HocuspocusProvider } from "@hocuspocus/provider";

export const createProvider = (
    documentId: string,
    token: string | null
): Promise<HocuspocusProvider | null> => {
    return new Promise<HocuspocusProvider>((resolve, reject) => {
        try {
            const provider = new HocuspocusProvider({
                url: "ws://localhost:1234",
                name: documentId,
                token: token,
                onSynced: () => resolve(provider),
            });

            setTimeout(() => {
                reject(
                    new Error(
                        "Hocuspocus provider timeout (onSynced not triggered)"
                    )
                );
            }, 5000);
        } catch (error) {
            reject(error);
        }
    }).catch((error) => {
        console.warn("createProvider failed:", error);
        return null;
    });
};
