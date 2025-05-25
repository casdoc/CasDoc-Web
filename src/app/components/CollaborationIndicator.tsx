"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserIcon, WifiIcon, WifiOffIcon } from "lucide-react";

interface CollaborationIndicatorProps {
    isConnected: boolean;
    status: string;
    onlineUsers: Array<{
        clientId: number;
        user: { name: string; color: string };
    }>;
}

export function CollaborationIndicator({
    isConnected,
    status,
    onlineUsers,
}: CollaborationIndicatorProps) {
    return (
        <div className="flex items-center gap-2">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Badge
                            variant={isConnected ? "default" : "destructive"}
                            className="gap-1"
                        >
                            {isConnected ? (
                                <WifiIcon size={14} />
                            ) : (
                                <WifiOffIcon size={14} />
                            )}
                            {isConnected ? "Connected" : "Disconnected"}
                        </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Status: {status}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <div className="flex -space-x-2">
                {onlineUsers.slice(0, 3).map((user) => (
                    <TooltipProvider key={user.clientId}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Avatar
                                    className="h-6 w-6 border-2 border-background"
                                    style={{ backgroundColor: user.user.color }}
                                >
                                    <AvatarFallback className="text-xs text-white">
                                        {user.user.name
                                            .substring(0, 2)
                                            .toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{user.user.name}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                ))}

                {onlineUsers.length > 3 && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Avatar className="h-6 w-6 border-2 border-background bg-muted">
                                    <AvatarFallback className="text-xs">
                                        +{onlineUsers.length - 3}
                                    </AvatarFallback>
                                </Avatar>
                            </TooltipTrigger>
                            <TooltipContent>
                                <div>
                                    {onlineUsers.slice(3).map((user) => (
                                        <p key={user.clientId}>
                                            {user.user.name}
                                        </p>
                                    ))}
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}

                {onlineUsers.length === 0 && (
                    <Avatar className="h-6 w-6 border-2 border-background">
                        <AvatarFallback className="bg-muted">
                            <UserIcon size={12} />
                        </AvatarFallback>
                    </Avatar>
                )}
            </div>
        </div>
    );
}
