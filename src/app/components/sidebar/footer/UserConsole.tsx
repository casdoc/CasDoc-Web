"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import { useRouter } from "next/navigation";
import SignOutButton from "./SignOutButton";

const UserConsole = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState("User");
    const [userEmail, setUserEmail] = useState("user@gmail.com");
    const [userAvatar, setUserAvatar] = useState("");
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
                setUserAvatar(user.user_metadata?.avatar_url || "");
            } else {
                setIsLoggedIn(false);
            }
            setIsLoading(false);
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

    if (isLoading) {
        return (
            <div className="flex items-center justify-between p-3 rounded-lg">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-full bg-muted animate-pulse" />
                    <div className="space-y-1">
                        <Skeleton className="h-4 w-24 bg-muted animate-pulse" />
                        <Skeleton className="h-3 w-32 bg-muted animate-pulse" />
                    </div>
                </div>
                <Skeleton className="h-6 w-6 rounded-md bg-muted animate-pulse" />
            </div>
        );
    }

    return (
        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-200 transition cursor-pointer">
            <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                    {userAvatar?.trim() && (
                        <AvatarImage src={userAvatar} alt="User" />
                    )}
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
