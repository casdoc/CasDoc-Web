"use client";

import LoginButton from "@/app/components/home/LoginButton";
import { Flex } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PiTestTube } from "react-icons/pi";

export default function Login() {
    const router = useRouter();
    const [loginLoading, setLoginLoading] = useState(false);

    const handleLoginClick = () => {
        setLoginLoading(true);
        // Note: We don't navigate here - the OAuth redirect will happen in LoginButton
    };

    const handleHomeClick = (e: React.MouseEvent) => {
        e.preventDefault();
        router.push("/");
    };

    const openBetaForm = () => {
        window.open("https://forms.gle/oDBCT3b9L9VnSWH3A", "_blank");
    };

    return (
        <div className="h-screen w-screen flex flex-col justify-center items-center bg-gradient-to-b from-gray-100 to-gray-200 px-4">
            <div className="w-full max-w-fit lg:max-w-md">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        Welcome to CasDoc
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Please choose a login method to get started
                    </p>
                </div>
                <Flex
                    direction="column"
                    className="sm:flex-row lg:items-start"
                    gap="4"
                    align="center"
                    justify="center"
                >
                    <LoginButton
                        handleClick={handleLoginClick}
                        loading={loginLoading}
                        disabled={false}
                    />
                    {/* ...existing code... */}
                </Flex>
                <Flex
                    gapX="7"
                    gapY="2"
                    justify="center"
                    align="center"
                    className="mt-8 md:ml-6 md:flex-row"
                    direction="column"
                >
                    <button
                        onClick={handleHomeClick}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        ← Back to Home
                    </button>
                    <button
                        onClick={openBetaForm}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        <Flex gapX="1">
                            <PiTestTube className="mt-0.5" />
                            Apply for Beta
                        </Flex>
                    </button>
                </Flex>
            </div>
        </div>
    );
}
