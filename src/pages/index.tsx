"use client";

import { useState } from "react";
import { LogoButton } from "@/app/components/LogoButton";
import Link from "next/link";
import "@/app/globals.css";
import GuideButton from "@/app/components/guide/GuideButton";

const Home = () => {
    const [loading, setLoading] = useState(false);

    const handleClick = () => {
        setLoading(true);
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
                <Link
                    href="/doc"
                    className="bg-black text-white font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg text-base sm:text-lg hover:bg-gray-700 transition-colors duration-300 select-none flex items-center justify-center min-w-[120px] sm:min-w-[140px]"
                    onClick={handleClick}
                >
                    {loading ? (
                        <>
                            <svg
                                className="animate-spin h-4 w-4 sm:h-5 sm:w-5 mr-2 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
                                ></path>
                            </svg>
                            Launching...
                        </>
                    ) : (
                        "Get Started"
                    )}
                </Link>
            </div>

            <footer className="w-full bg-gray-100 border-t border-gray-300 py-4 sm:py-6">
                <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left">
                    <p className="text-gray-600 text-sm">
                        © {new Date().getFullYear()} CasDoc. All rights
                        reserved.
                    </p>
                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                        <Link
                            href="mailto:casdoc.official@gmail.com"
                            className="text-gray-600 text-sm hover:text-gray-800 transition-colors"
                        >
                            casdoc.official@gmail.com
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
