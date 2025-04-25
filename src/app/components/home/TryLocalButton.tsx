"use client";

import { Text } from "@radix-ui/themes";
import { useRouter } from "next/router";

interface TryLocalButtonProps {
    handleClick: () => void;
    loading: boolean;
    disabled: boolean;
}

const TryLocalButton = ({
    handleClick,
    loading,
    disabled,
}: TryLocalButtonProps) => {
    const router = useRouter();

    const handleLocalClick = () => {
        handleClick();
        router.push("/doc");
    };

    return (
        <button
            disabled={disabled}
            className={`border border-gray-500 px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-gray-200 transition-colors duration-300 select-none flex items-center justify-center min-w-[120px] sm:min-w-[140px] ${
                disabled ? "cursor-not-allowed" : "cursor-pointer"
            }`}
            onClick={handleLocalClick}
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
                    Launching
                </>
            ) : (
                <Text
                    weight="bold"
                    size="5"
                    className="lg:text-lg"
                    color="gray"
                >
                    Quick Start
                </Text>
            )}
        </button>
    );
};

export default TryLocalButton;
