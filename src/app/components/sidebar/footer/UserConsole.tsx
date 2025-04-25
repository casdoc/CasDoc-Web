import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import { useRouter } from "next/router";

const UserConsole = () => {
    const [userName, setUserName] = useState("User");
    const [userEmail, setUserEmail] = useState("user@gmail.com");
    const router = useRouter();

    useEffect(() => {
        const getUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (user) {
                setUserName(user.user_metadata.name ?? "User");
                setUserEmail(user.email ?? "user@email.com");
            }
        };
        getUser();
    }, []);

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            router.push("/");
        } else {
            console.log("Sign out error: ", error);
        }
    };

    return (
        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-200 transition cursor-pointer">
            <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                    <AvatarImage src="/user-avatar.png" alt="User" />
                    <AvatarFallback>
                        {userName?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                </Avatar>
                <div className="space-y-0.5">
                    <p className="text-sm font-medium leading-none">
                        {userName}
                    </p>
                    <p className="text-xs text-muted-foreground">{userEmail}</p>
                </div>
            </div>
            <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-red-500"
                onClick={handleSignOut}
            >
                <LogOut className="h-4 w-4" />
            </Button>
        </div>
    );
};

export default UserConsole;
