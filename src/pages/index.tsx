"use server";

import { useState } from "react";
import { useRouter } from "next/router";
import LogoButton from "@/app/components/LogoButton";
import GuideButton from "@/app/components/guide/GuideButton";
import StartButton from "@/app/components/home/StartButton";
import Footer from "@/app/components/home/Footer";
import "@/app/globals.css";
import { Button } from "@/components/ui/button";

const Home = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleClick = () => {
        setLoading(true);
    };

    const handleTryLocal = () => {
        router.push("/doc");
    };

    return (
        <div className="flex flex-col h-dvh bg-gray-100 font-sans">
            <div className="relative flex-1 flex flex-col items-center justify-center px-4 text-center">
                <div className="absolute top-4 left-0 md:left-4">
                    <LogoButton />
                </div>
                <div className="absolute top-4 right-4 md:right-8">
                    <GuideButton />
                </div>
                <h1 className="text-4xl sm:text-6xl font-bold mb-6 sm:mb-8 text-gray-800 select-none">
                    Trace text relationships.
                </h1>
                <h2 className="text-lg sm:text-2xl mb-10 sm:mb-14 max-w-md sm:max-w-2xl text-gray-600 select-none">
                    CasDoc is a docs-editing tool that enhances{" "}
                    <br className="hidden sm:block" />
                    traceability through document structure visualization.
                </h2>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <StartButton handleClick={handleClick} loading={loading} />
                    <button
                        onClick={handleTryLocal}
                        className="bg-gray-600 text-white font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg text-base sm:text-lg hover:bg-gray-700 transition-colors duration-300 select-none flex items-center justify-center min-w-[120px] sm:min-w-[140px]"
                    >
                        Try Local
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Home;
