"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import { useRouter } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function CallbackPage() {
    const [user, setUser] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            const accessToken = session?.access_token;
            if (!accessToken) {
                return;
            }
            try {
                const res = await fetch(`${baseUrl}/me`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                if (res.ok) {
                    const text = await res.text();
                    setUser(text);
                } else {
                    setUser("驗證失敗");
                }
            } catch (err) {
                console.debug("failed to fetch callback:", err);
                router.push("/");
            }
        };

        fetchUser();
    }, [router]);

    useEffect(() => {
        if (user) {
            router.push("/document/overview");
        }
    }, [user, router]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
                {!user ? (
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                        <h3 className="text-lg font-medium text-gray-700">
                            載入中...
                        </h3>
                        <p className="text-sm text-gray-500">
                            正在驗證您的身份，請稍候
                        </p>
                    </div>
                ) : user === "驗證失敗" ? (
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6 text-red-600"
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
                        </div>
                        <h3 className="text-lg font-medium text-red-700">
                            驗證失敗
                        </h3>
                        <p className="text-sm text-gray-500">
                            無法驗證您的身份，請重新登入
                        </p>
                        <button
                            onClick={() => router.push("/login")}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            返回登入頁面
                        </button>
                    </div>
                ) : (
                    <div className="text-center">{user}</div>
                )}
            </div>
        </div>
    );
}
