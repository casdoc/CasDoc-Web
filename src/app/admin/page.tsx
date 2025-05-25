"use client";

import { Button } from "@/components/ui/button";
import supabase from "@/lib/supabase";
import { Flex } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Admin() {
    const router = useRouter();
    const [redirecting, setRedirecting] = useState(false);

    const loginWithGoogle = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
    };

    useEffect(() => {
        // Use a flag to prevent multiple redirects
        if (!redirecting) {
            setRedirecting(true);
            router.push("/login");
        }
    }, [router, redirecting]);

    // If we're redirecting, don't render the content
    if (redirecting) {
        return (
            <div className="h-screen w-screen flex items-center justify-center">
                Redirecting...
            </div>
        );
    }

    return (
        <Flex justify="center" align="center" className="h-screen w-screen">
            <Button onClick={loginWithGoogle}>
                Login with Google as Admin
            </Button>
        </Flex>
    );
}
