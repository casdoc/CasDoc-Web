import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import { useRouter } from "next/router";
import SignOutButton from "./SignOutButton";

const UserConsole = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState("User");
    const [userEmail, setUserEmail] = useState("user@gmail.com");
    const [userAvatar, setUserAvatar] = useState("/user-avatar.png");
    const [openSignOut, setOpenSignOut] = useState(false);
    const router = useRouter();

    useEffect(() => {
        let mounted = true;

        const getUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (mounted && user) {
                setIsLoggedIn(true);
                setUserName(user.user_metadata?.name || "Guest");
                setUserEmail(user.email || "user@email.com");
                setUserAvatar(
                    user.user_metadata?.avatar_url || "/user-avatar.png"
                );
            } else {
                setIsLoggedIn(false);
            }
        };

        getUser();

        return () => {
            mounted = false;
        };
    }, []);

    const handleSignOut = async () => {
        if (!isLoggedIn) return;
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
                    <AvatarImage src={userAvatar} alt="User" />
                    <AvatarFallback>
                        {userName?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                </Avatar>
                <div className="space-y-0.5">
                    <p className="text-sm font-medium leading-none">
                        {userName}
                    </p>
                    <p
                        className="text-xs text-muted-foreground truncate max-w-[130px]"
                        title={userEmail}
                    >
                        {userEmail}
                    </p>
                </div>
            </div>
            {isLoggedIn && (
                <SignOutButton
                    open={openSignOut}
                    setOpen={setOpenSignOut}
                    signOut={handleSignOut}
                />
            )}
        </div>
    );
};

export default UserConsole;
