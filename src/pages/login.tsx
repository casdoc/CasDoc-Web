"use client";

import LoginButton from "@/app/components/home/LoginButton";
// import TryLocalButton from "@/app/components/home/TryLocalButton";
import { Flex } from "@radix-ui/themes";
import { useRouter } from "next/router";
import { useState } from "react";
import { PiTestTube } from "react-icons/pi";

const Login = () => {
    const router = useRouter();
    const [loginLoading, setLoginLoading] = useState(false);
    // const [localLoading, setLocalLoading] = useState(false);
    // const [buttonDisabled, setButtonDisabled] = useState(false);

    const handleLoginClick = () => {
        // setButtonDisabled(true);
        setLoginLoading(true);
    };

    // const handleLocalClick = () => {
    //     setButtonDisabled(true);
    //     setLocalLoading(true);
    // };

    const goToHome = () => {
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
                    {/* <Flex direction="column" align="center">
                        <TryLocalButton
                            handleClick={handleLocalClick}
                            loading={localLoading}
                            disabled={true}
                        />
                        <span className="text-xs text-gray-500 mt-1">
                            {"Your data won't be saved."}
                        </span>
                    </Flex> */}
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
                        onClick={goToHome}
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
};

export default Login;
