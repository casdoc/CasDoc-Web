import Head from "next/head";
import { AppProps } from "next/app";
import NextTopLoader from "nextjs-toploader";
import "@/app/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>CasDoc</title>
                <link rel="icon" type="image/svg+xml" href="/spine-icon.svg" />
                <meta name="description" content="Established by CasDoc" />
            </Head>
            <NextTopLoader showSpinner={false} />
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;
