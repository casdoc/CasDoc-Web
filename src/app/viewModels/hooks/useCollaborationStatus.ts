"use client";

import { useState, useEffect } from "react";
import { HocuspocusProvider } from "@hocuspocus/provider";
import supabase from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

export interface CollaborationUser {
    clientId: number;
    user: {
        id: string;
        name: string;
        color: string;
        email?: string;
        avatar?: string;
    };
}
interface AwarenessState {
    user?: {
        id: string;
        name: string;
        color: string;
        email?: string;
        avatar?: string;
    };
    [key: string]: unknown;
}

export const useCollaborationStatus = (provider?: HocuspocusProvider) => {
    const [onlineUsers, setOnlineUsers] = useState<CollaborationUser[]>([]);

    const [currentUser, setCurrentUser] = useState<User | null>(null);

    // Get current user from Supabase
    useEffect(() => {
        const getCurrentUser = async () => {
            const { data } = await supabase.auth.getSession();
            if (data.session?.user) {
                setCurrentUser(data.session.user);
            }
        };

        getCurrentUser();

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            setCurrentUser(session?.user || null);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (!provider?.isSynced) return;

        const handleAwarenessUpdate = () => {
            const users: CollaborationUser[] = [];

            provider.awareness
                ?.getStates()
                .forEach((state: AwarenessState, clientId: number) => {
                    if (state.user) {
                        users.push({
                            clientId,
                            user: {
                                id: state.user.id || String(clientId),
                                name: state.user.name || "Anonymous",
                                color: state.user.color || "#000000",
                                email: state.user.email,
                                avatar: state.user.avatar,
                            },
                        });
                    }
                });

            setOnlineUsers(users);
        };

        provider.awareness?.on("update", handleAwarenessUpdate);

        // Set current user awareness
        if (currentUser) {
            provider.awareness?.setLocalStateField("user", {
                id: currentUser.id,
                name:
                    currentUser.user_metadata?.full_name ||
                    currentUser.user_metadata?.email ||
                    currentUser.email?.split("@")[0] ||
                    "Anonymous",
                color: `#${Math.floor(Math.random() * 0x888888 + 0x777777)
                    .toString(16)
                    .padStart(6, "0")}`,
                email: currentUser.email,
                avatar: currentUser.user_metadata?.avatar_url,
            });
        }

        return () => {
            provider.awareness?.off("update", handleAwarenessUpdate);
        };
    }, [provider, currentUser]);

    return {
        onlineUsers,
        userCount: onlineUsers.length,
    };
};
