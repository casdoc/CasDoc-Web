"use client";

import Image from "next/image";
import { useState } from "react";

interface GuidePopupProps {
    onClose: () => void;
}

interface TabContent {
    image: string;
    alt: string;
    tittle: string;
    description: string;
    layout: "left" | "right";
}

const GuidePopup = ({ onClose }: GuidePopupProps) => {
    const [currentTab, setCurrentTab] = useState(0);
    const [imageLoaded, setImageLoaded] = useState(false);

    const tabs: TabContent[] = [
        {
            image: "/guideA.png",
            alt: "Guideline 1",
            tittle: "Type Slash!",
            description:
                'Type the "/" command to attach topics or templates from the menu, and they will appear as nodes in the diagram panel arranged in a tree structure.',
            layout: "left",
        },
        {
            image: "/guideB.png",
            alt: "Guideline 2",
            tittle: "Connect Them!",
            description:
                "Drag the node’s handle points to establish connections between nodes, and you can click on the nodes to trace these connections.",
            layout: "right",
        },
    ];

    const currentGuide = tabs[currentTab];
    const progress = ((currentTab + 1) / tabs.length) * 100;

    const handleClickOutside = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    const handleClick = () => {
        setImageLoaded(false);
        setCurrentTab((prev) => (prev + 1 >= tabs.length ? 0 : prev + 1));
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={handleClickOutside}
        >
            <div className="bg-gray-100 font-sans w-full max-w-7xl mx-auto px-4 py-8 relative overflow-y-auto max-h-[calc(100vh-2rem)] m-4 rounded-xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
                    title="Close"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                <h1 className="text-3xl md:text-4xl font-bold text-center my-8 text-gray-800">
                    Guidelines
                </h1>

                <div className="w-full bg-gray-300 h-2 rounded-full overflow-hidden mb-6">
                    <div
                        className="h-full bg-blue-500 transition-all duration-700"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                <div className="space-y-12 mb-8 md:mb-32">
                    <div
                        className={`flex flex-col md:${
                            currentGuide.layout === "left"
                                ? "flex-row"
                                : "flex-row-reverse"
                        } items-center space-y-8 md:space-y-0 md:space-x-8 my-8`}
                    >
                        <div className="relative w-full md:w-auto">
                            {!imageLoaded && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                                    <span className="text-gray-500">
                                        Loading...
                                    </span>
                                </div>
                            )}
                            <Image
                                src={currentGuide.image}
                                alt={currentGuide.alt}
                                width={700}
                                height={500}
                                className={`w-full md:w-auto rounded-xl shadow-xl border border-gray-300 transition-opacity duration-500 ${
                                    imageLoaded ? "opacity-100" : "opacity-0"
                                }`}
                                loading="lazy"
                                onLoad={() => setImageLoaded(true)}
                            />
                        </div>
                        <div className="px-4 text-center md:text-left">
                            <h2 className="mb-4 text-2xl md:text-4xl font-semibold">
                                {currentGuide.tittle}
                            </h2>
                            <p className="text-gray-600 text-base md:text-lg">
                                {currentGuide.description}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end items-center">
                    <button
                        onClick={handleClick}
                        className="mx-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors shadow-lg"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GuidePopup;
