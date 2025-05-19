"use client";

import { Button } from "@/components/ui/button";
import supabase from "@/lib/supabase";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

interface LoginButtonProps {
    handleClick: () => void;
    loading: boolean;
    disabled: boolean;
}

export default function LoginButton({
    handleClick,
    loading,
    disabled,
}: LoginButtonProps) {
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const loginWithGoogle = async () => {
        // Prevent multiple clicks
        if (isLoggingIn) return;

        setIsLoggingIn(true);
        handleClick();

        try {
            await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
        } catch (error) {
            console.error("Login error:", error);
            setIsLoggingIn(false);
        }
    };

    return (
        <Button
            onClick={loginWithGoogle}
            disabled={disabled || loading || isLoggingIn}
            className="bg-white hover:bg-gray-100 text-gray-800 py-2 px-4 border border-gray-400 rounded-lg shadow flex items-center justify-center space-x-2 w-[220px] transition-all"
        >
            <FcGoogle className="h-5 w-5" />
            <span>{loading ? "Logging in..." : "Continue with Google"}</span>
            {loading && (
                <div className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
            )}
        </Button>
    );
}
