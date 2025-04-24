"use server";

import supabase from "@/lib/supabase";
import { Flex } from "@radix-ui/themes";
import { FcGoogle } from "react-icons/fc";

interface LoginButtonProps {
    handleClick: () => void;
    loading: boolean;
    disabled: boolean;
}

const LoginButton = ({ handleClick, loading, disabled }: LoginButtonProps) => {
    const loginWithGoogle = async () => {
        handleClick();
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `https://casdoc.io/auth/callback`,
            },
        });
    };

    return (
        <button
            disabled={disabled}
            className={`bg-blue-500 text-white font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg text-base sm:text-lg hover:bg-gray-500 transition-colors duration-300 select-none flex items-center justify-center min-w-[120px] sm:min-w-[140px] ${
                disabled ? "cursor-not-allowed" : "cursor-pointer"
            }`}
            onClick={loginWithGoogle}
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
                <Flex gapX="2">
                    <span>Login with</span>
                    <FcGoogle
                        className="relative top-0.5 bg-white rounded-full"
                        size={23}
                    />
                </Flex>
            )}
        </button>
    );
};

export default LoginButton;
