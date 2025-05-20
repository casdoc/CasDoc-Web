"use client";

import { useProjectContext } from "@/app/viewModels/context/ProjectContext";
import dynamic from "next/dynamic";
import "@/app/globals.css";
import { use, useEffect } from "react";
import { LoadingMask } from "../page";

interface PageProps {
    params: {
        documentId: string;
    };
}

const DocumentContent = dynamic(
    () => import("@/app/components/DocumentContent"),
    {
        ssr: false,
        loading: () => <LoadingMask />,
    }
);

export default function DocumentPage({ params }: PageProps) {
    const unwrappedParams = use(
        params as unknown as Promise<PageProps["params"]>
    );
    const { documentId } = unwrappedParams;

    const { selectDocument } = useProjectContext();

    useEffect(() => {
        if (documentId) {
            selectDocument(documentId);
        }
    }, [documentId, selectDocument]);

    return <DocumentContent />;
}
