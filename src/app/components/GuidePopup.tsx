"use client";

import Image from "next/image";

interface GuidePopupProps {
    onClose: () => void;
}

const GuidePopup = ({ onClose }: GuidePopupProps) => {
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
            <div className="bg-gray-100 font-sans w-full max-w-7xl mx-auto px-4 py-8 relative overflow-y-auto max-h-[calc(100vh-2rem)] my-14 rounded-xl">
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
        </div>
    );
};

export default GuidePopup;
