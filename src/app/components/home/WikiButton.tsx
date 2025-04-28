import Link from "next/link";
import { MdMenuBook } from "react-icons/md";
import { Flex } from "@radix-ui/themes";

const WikiButton = () => {
    return (
        <Link
            href="/wiki"
            target="_blank"
            className="bg-white border text-gray-500 border-gray-300 font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg text-base sm:text-lg hover:opacity-50 transition-opacity select-none flex items-center justify-center min-w-fit"
        >
            <Flex gapX="3">
                <MdMenuBook
                    className="relative top-0.5 text-gray-500"
                    size={22}
                />
                Wiki
            </Flex>
        </Link>
    );
};

export default WikiButton;
