"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import { useRouter } from "next/router";

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

            const res = await fetch("http://localhost:8080/me", {
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
        };

        fetchUser();
    }, []);

    useEffect(() => {
        if (user) {
            router.push("/doc");
        }
    }, [user, router]);

    return <div>{user ? user : "載入中..."}</div>;
}
