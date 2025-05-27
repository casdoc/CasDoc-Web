"use client";

import dynamic from "next/dynamic";
import "@/app/globals.css";
import { LoadingMask } from "../components/LoadingMask";

const DocumentContent = dynamic(
    () => import("@/app/components/DocumentContent"),
    {
        ssr: false,
        loading: () => <LoadingMask />,
    }
);

export default function DocumentPage() {
    return <DocumentContent />;
}
