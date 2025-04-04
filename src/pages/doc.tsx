"use client";

import dynamic from "next/dynamic";
import "@/app/globals.css";

const DocumentContent = dynamic(
    () => import("@/app/components/DocumentContent"),
    {
        ssr: false,
    }
);

export default function Doc() {
    const documentId = "default-document";
    return <DocumentContent documentId={documentId} />;
}
