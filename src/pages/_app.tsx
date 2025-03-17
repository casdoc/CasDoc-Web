import Head from "next/head";
import { AppProps } from "next/app";
import NextTopLoader from "nextjs-toploader";
import { Theme } from "@radix-ui/themes";
import "@/app/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <Theme>
            <Head>
                <title>CasDoc</title>
                <link rel="icon" type="image/svg+xml" href="/spine-icon.svg" />
                <meta
                    name="description"
                    content="CasDoc is a docs-editing tool that enhances traceability through document structure visualization."
                />
                <meta
                    name="keywords"
                    content="CasDoc, software, software engineering, software development, software document, documentation, document traceability, software traceability"
                />
                <meta property="og:title" content="CasDoc" />
                <meta
                    property="og:description"
                    content="CasDoc is a docs-editing tool that enhances traceability through document structure visualization."
                />
                <meta property="og:url" content="https://casdoc.io" />
            </Head>
            <NextTopLoader showSpinner={false} />
            <Component {...pageProps} />
        </Theme>
    );
}

export default MyApp;
