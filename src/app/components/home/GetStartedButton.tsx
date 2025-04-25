"use client";

import Link from "next/link";

const GetStartedButton = () => {
    return (
        <Link
            href="/login"
            className={`bg-gray-900 text-white font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg text-base sm:text-lg hover:bg-gray-700 transition-colors duration-300 select-none flex items-center justify-center min-w-[120px] sm:min-w-[140px]`}
        >
            Get Started
        </Link>
    );
};

export default GetStartedButton;
