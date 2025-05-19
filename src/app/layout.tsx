import type { Metadata, Viewport } from "next";
import { Theme } from "@radix-ui/themes";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/toaster";
import "@/app/globals.css";

export const viewport: Viewport = {
    themeColor: "#ffffff",
};

export const metadata: Metadata = {
    title: "CasDoc",
    description:
        "CasDoc is a docs-editing tool that enhances traceability through document structure visualization.",
    keywords:
        "CasDoc, software, software engineering, software development, software document, documentation, document traceability, software traceability",
    icons: {
        icon: [
            { url: "/favicon.ico", sizes: "any" },
            { url: "/icon.svg", type: "image/svg+xml" },
        ],
        apple: "/apple-touch-icon.png",
    },
    openGraph: {
        title: "CasDoc",
        description:
            "CasDoc is a docs-editing tool that enhances traceability through document structure visualization.",
        url: "https://casdoc.io",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <Theme>
                    <NextTopLoader showSpinner={false} />
                    {children}
                    <Toaster />
                </Theme>
            </body>
        </html>
    );
}
