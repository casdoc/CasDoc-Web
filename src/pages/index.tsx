"use server";

import "@/app/globals.css";
import LogoButton from "@/app/components/home/LogoButton";
// import GuideButton from "@/app/components/guide/GuideButton";
import Footer from "@/app/components/home/Footer";
import GetStartedButton from "@/app/components/home/GetStartedButton";
import { Flex } from "@radix-ui/themes";
import WikiButton from "@/app/components/home/WikiButton";

const Home = () => {
    return (
        <Flex direction="column" className="h-dvh bg-gray-100 font-sans">
            <Flex
                direction="column"
                justify="center"
                align="center"
                className="relative flex-1 px-4 text-center"
            >
                <div className="mb-12 mr-5">
                    <LogoButton />
                </div>
                {/* <div className="absolute top-4 right-4 md:right-8">
                    <GuideButton />
                </div> */}
                <h1 className="text-4xl sm:text-6xl font-bold mb-6 sm:mb-8 text-gray-800 select-none">
                    Trace text relationships.
                </h1>
                <h2 className="text-lg sm:text-2xl mb-10 sm:mb-14 max-w-md sm:max-w-2xl text-gray-600 select-none">
                    CasDoc is a docs-editing tool that enhances{" "}
                    <br className="hidden sm:block" />
                    traceability through document structure visualization.
                </h2>
                <Flex gapX="5">
                    <GetStartedButton />
                    <WikiButton />
                </Flex>
            </Flex>
            <Footer />
        </Flex>
    );
};

export default Home;
