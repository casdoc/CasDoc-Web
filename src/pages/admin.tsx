import { Button } from "@/components/ui/button";
import supabase from "@/lib/supabase";
import { Flex } from "@radix-ui/themes";

export default function Admin() {
    const loginWithGoogle = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `http://localhost:3000/auth/callback`,
            },
        });
    };

    return (
        <Flex justify="center" align="center" className="h-screen w-screen">
            <Button onClick={loginWithGoogle}>
                Login with Google as Admin
            </Button>
        </Flex>
    );
}
