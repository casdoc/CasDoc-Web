"use client";

import "@/app/globals.css";
import DocView from "@/app/components/doc/DocView";

export default function Home() {
    return (
        <div className="min-w-fit min-h-screen flex flex-col items-center bg-gray-200 text-black">
            <DocView />
        </div>
    );
}
