"use client";

import { Flex } from "@radix-ui/themes";
import Link from "next/link";
import { FaBookmark } from "react-icons/fa";

const GetStartedButton = () => {
    return (
        <Link
            href="/login"
            className={`bg-blue-500 text-white font-bold px-4 py-2 sm:py-3 rounded-lg shadow-lg text-base sm:text-lg hover:bg-blue-700 transition-colors duration-300 select-none flex items-center justify-center min-w-[120px] sm:min-w-[140px]`}
        >
            <Flex gapX="2">
                <FaBookmark className="relative top-1.5" size={16} />
                Get Started
            </Flex>
        </Link>
    );
};

export default GetStartedButton;
