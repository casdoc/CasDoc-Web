"use client";

import { useState } from "react";
import { LogoButton } from "@/app/components/LogoButton";
import Link from "next/link";
import "@/app/globals.css";
import GuideButton from "@/app/components/GuideButton";

const Home = () => {
    const [loading, setLoading] = useState(false);

    const handleClick = () => {
        setLoading(true);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 font-sans">
            <div className="relative flex-1 flex flex-col items-center justify-center px-4">
                <div className="absolute top-4 left-4">
                    <LogoButton />
                </div>
                <div className="absolute top-4 right-4">
                    <GuideButton />
                </div>
                <h1 className="text-6xl font-bold text-center mb-8 text-gray-800 select-none">
                    Trace text relationships.
                </h1>
                <h2 className="text-2xl text-center mb-14 max-w-2xl text-gray-600 select-none">
                    CasDoc is a docs-editing tool that enhances <br />
                    traceability through document structure visualization.
                </h2>
                <Link
                    href="/doc"
                    aria-disabled={loading}
                    className={`bg-black text-white font-bold px-6 py-3 rounded-lg shadow-lg text-lg hover:bg-gray-700 transition-colors duration-300 select-none text-center min-w-[140px] ${
                        loading && "opacity-60 cursor-not-allowed"
                    }`}
                    onClick={handleClick}
                >
                    {loading ? "Loading..." : "Get Started"}
                </Link>
            </div>

            <footer className="w-full bg-gray-100 border-t border-gray-300 py-6">
                <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between">
                    <p className="text-gray-600 text-sm">
                        © {new Date().getFullYear()} CasDoc. All rights
                        reserved.
                    </p>
                    <div className="flex items-center gap-2 mt-4 sm:mt-0">
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
