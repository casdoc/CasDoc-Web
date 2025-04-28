import { Button } from "@/components/ui/button";
import supabase from "@/lib/supabase";
import { Flex } from "@radix-ui/themes";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Admin() {
    const router = useRouter();

    const loginWithGoogle = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `http://localhost:3000/auth/callback`,
            },
        });
    };

    useEffect(() => {
        router.push("/login");
    }, [router]);

    return (
        <Flex justify="center" align="center" className="h-screen w-screen">
            <Button onClick={loginWithGoogle}>
                Login with Google as Admin
            </Button>
        </Flex>
    );
}
