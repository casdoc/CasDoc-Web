"use server";

// import LoginButton from "@/app/components/home/LoginButton";
import TryLocalButton from "@/app/components/home/TryLocalButton";
import { useState } from "react";

const Login = () => {
    // const [loginLoading, setLoginLoading] = useState(false);
    const [localLoading, setLocalLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    // const handleLoginClick = () => {
    //     setButtonDisabled(true);
    //     setLoginLoading(true);
    // };

    const handleLocalClick = () => {
        setButtonDisabled(true);
        setLocalLoading(true);
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
                <div className="flex flex-col sm:flex-row gap-4 items-center lg:items-start justify-center">
                    {/* <LoginButton
                        handleClick={handleLoginClick}
                        loading={loginLoading}
                        disabled={buttonDisabled}
                    /> */}
                    <div className="flex flex-col items-center">
                        <TryLocalButton
                            handleClick={handleLocalClick}
                            loading={localLoading}
                            disabled={buttonDisabled}
                        />
                        <span className="text-xs text-gray-500 mt-1">
                            {"Your data won't be saved."}
                        </span>
                    </div>
                </div>
                <div className="mt-10 text-center">
                    <button
                        className="text-sm text-blue-600 hover:underline"
                        onClick={() => (window.location.href = "/")}
                    >
                        ← Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
