"use client";

import { useState } from "react";
import { loadDocument, createDocument } from "../actions/documentActions";

export default function DocumentForm() {
    const [documentName, setDocumentName] = useState("");
    const [result, setResult] = useState<any>(null);

    // Using server action
    async function handleLoadWithServerAction() {
        if (!documentName) return;

        const response = await loadDocument(documentName);
        setResult(response);
    }

    // Using API route
    async function handleLoadWithApiRoute() {
        if (!documentName) return;

        try {
            const response = await fetch(
                `/api/documents?documentName=${encodeURIComponent(
                    documentName
                )}`
            );
            const data = await response.json();
            setResult(data);
        } catch (error) {
            setResult({ error: (error as Error).message });
        }
    }

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Document Operations</h1>

            <div className="mb-4">
                <input
                    type="text"
                    value={documentName}
                    onChange={(e) => setDocumentName(e.target.value)}
                    placeholder="Document name"
                    className="border p-2 mr-2"
                />

                <button
                    onClick={handleLoadWithServerAction}
                    className="bg-blue-500 text-white p-2 mr-2"
                >
                    Load (Server Action)
                </button>

                <button
                    onClick={handleLoadWithApiRoute}
                    className="bg-green-500 text-white p-2"
                >
                    Load (API Route)
                </button>
            </div>

            {result && (
                <div className="mt-4 p-4 border rounded bg-gray-50">
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}
