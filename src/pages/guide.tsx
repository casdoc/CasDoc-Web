"use client";

import Image from "next/image";
import Link from "next/link";
import { LogoButton } from "@/app/components/LogoButton";
import "@/app/globals.css";

const Guideline = () => {
    return (
        <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
            <div className="w-full max-w-7xl mx-auto px-4 py-8 mb-48">
                <div className="flex justify-between items-center mb-8">
                    <LogoButton />
                    <Link href="/" className="text-gray-700 hover:underline">
                        Back to Home
                    </Link>
                </div>
                <h1 className="text-4xl font-bold text-center my-12 text-gray-800">
                    Guidelines
                </h1>
                <div className="space-y-12">
                    <div className="flex flex-col my-60 md:flex-row items-center md:space-x-8">
                        <div className="flex-shrink-0">
                            <Image
                                src="/guideA.png"
                                alt="Guideline 1"
                                width={700}
                                height={500}
                                className="mx-16 rounded-xl shadow-xl border border-gray-300"
                            />
                        </div>
                        <div className="mt-4 md:mt-0">
                            <p className="text-gray-600 text-lg">
                                Type the{" "}
                                <span className="mx-1 px-2.5 pb-1 pt-0.5 bg-gray-500 text-white rounded-md shadow-xl opacity-70 select-none hover:opacity-50">
                                    /
                                </span>{" "}
                                command to attach topics or templates from the
                                menu, and they will appear as nodes in the
                                diagram panel arranged in a tree structure.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col my-60 md:flex-row-reverse items-center md:space-x-8">
                        <div className="flex-shrink-0">
                            <Image
                                src="/guideB.png"
                                alt="Guideline 2"
                                width={700}
                                height={500}
                                className="mx-16 rounded-xl shadow-xl border border-gray-300"
                            />
                        </div>
                        <div className="mt-4 md:mt-0">
                            <p className="text-gray-600 text-lg">
                                Drag the node’s handle points to establish
                                connections between nodes, and you can click on
                                the nodes to trace these connections.
                            </p>
                        </div>
                    </div>
                </div>
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

export default Guideline;
