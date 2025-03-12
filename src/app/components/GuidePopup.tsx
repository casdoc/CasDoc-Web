"use client";

import Image from "next/image";
import { useState } from "react";

interface GuidePopupProps {
    onClose: () => void;
}

interface TabContent {
    image: string;
    alt: string;
    description: string;
    layout: "left" | "right";
}

const GuidePopup = ({ onClose }: GuidePopupProps) => {
    const [currentTab, setCurrentTab] = useState(0);

    const tabs: TabContent[] = [
        {
            image: "/guideA.png",
            alt: "Guideline 1",
            description:
                'Type the "/" command to attach topics or templates from the menu, and they will appear as nodes in the diagram panel arranged in a tree structure.',
            layout: "left",
        },
        {
            image: "/guideB.png",
            alt: "Guideline 2",
            description:
                "Drag the node’s handle points to establish connections between nodes, and you can click on the nodes to trace these connections.",
            layout: "right",
        },
    ];

    const currentGuide = tabs[currentTab];

    const handleClickOutside = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
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

                <h1 className="text-4xl font-bold text-center my-12 text-gray-800">
                    Guidelines
                </h1>

                <div className="space-y-12 mb-32">
                    <div
                        className={`flex ${
                            currentGuide.layout === "left"
                                ? "flex-row"
                                : "flex-row-reverse"
                        } my-20 items-center space-x-8`}
                    >
                        <div className="flex-shrink-0">
                            <Image
                                src={currentGuide.image}
                                alt={currentGuide.alt}
                                width={700}
                                height={500}
                                className="mx-8 rounded-xl shadow-xl border border-gray-300"
                                loading="lazy"
                            />
                        </div>
                        <div>
                            <p className="text-gray-600 text-lg">
                                {currentGuide.description}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end items-center">
                    <button
                        onClick={() =>
                            setCurrentTab((prev) => {
                                return prev + 1 >= tabs.length ? 0 : prev + 1;
                            })
                        }
                        className="mx-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
                    >
                        Next
                    </button>
                    <span className="mx-2 select-none">
                        ({currentTab + 1}/{tabs.length})
                    </span>
                </div>
            </div>
        </div>
    );
};

export default GuidePopup;
