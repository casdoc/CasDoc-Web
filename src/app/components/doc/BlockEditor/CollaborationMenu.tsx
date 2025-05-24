"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, Users, Wifi, WifiOff, AlertTriangle } from "lucide-react";
import { CollaborationUser } from "@/app/viewModels/hooks/useCollaborationStatus";
import { CollaborationStatus } from "@/app/viewModels/context/CollabProviderContext";

interface CollaborationMenuProps {
    onlineUsers: CollaborationUser[];
    status: CollaborationStatus;
    userCount: number;
}

const getStatusIcon = (status: CollaborationStatus) => {
    switch (status) {
        case CollaborationStatus.Synced:
        case CollaborationStatus.Connected:
            return <Wifi className="h-3 w-3" />;
        case CollaborationStatus.UnsyncedChanges:
            return <AlertTriangle className="h-3 w-3" />;
        case CollaborationStatus.Error:
        case CollaborationStatus.Disconnected:
            return <WifiOff className="h-3 w-3" />;
        default:
            return <WifiOff className="h-3 w-3" />;
    }
};

const getStatusColor = (status: CollaborationStatus) => {
    // console.debug("getStatusColor called with status:", status);
    switch (status) {
        case CollaborationStatus.Synced:
        case CollaborationStatus.Connected:
            return "bg-green-500";
        case CollaborationStatus.UnsyncedChanges:
            return "bg-yellow-500";
        case CollaborationStatus.Error:
        case CollaborationStatus.Disconnected:
            return "bg-red-500";
        default:
            return "bg-gray-500";
    }
};

const getStatusText = (status: CollaborationStatus) => {
    switch (status) {
        case CollaborationStatus.Synced:
            return "Synced";
        case CollaborationStatus.Connected:
            return "Connected";
        case CollaborationStatus.UnsyncedChanges:
            return "Syncing...";
        case CollaborationStatus.Error:
            return "Error";
        case CollaborationStatus.Disconnected:
            return "Disconnected";
        default:
            return "Unknown";
    }
};

export function CollaborationMenu({
    onlineUsers,
    status,
    userCount,
}: CollaborationMenuProps) {
    return (
        <div className="flex items-center gap-2 select-none">
            {/* Status indicator */}
            <div className="flex items-center gap-1">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div
                                className={`w-2 h-2 rounded-full ${getStatusColor(
                                    status
                                )}`}
                            />
                            {/* <span className="flex items-center gap-1">
                                {getStatusIcon(status)}
                                <span className="text-sm font-medium">
                                    {getStatusText(status)}
                                </span>
                            </span> */}
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{getStatusText(status)}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            {/* Users dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 h-8  select-none"
                    >
                        <Users className="h-4 w-4" />
                        <span className="text-sm">{userCount}</span>
                        <ChevronDown className="h-3 w-3" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                    <DropdownMenuLabel className="flex items-center gap-2">
                        {getStatusIcon(status)}
                        Online Users ({userCount})
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {onlineUsers.length === 0 ? (
                        <DropdownMenuItem disabled>
                            No users online
                        </DropdownMenuItem>
                    ) : (
                        onlineUsers.map((collaborator) => (
                            <DropdownMenuItem
                                key={collaborator.clientId}
                                className="flex items-center gap-3 p-3"
                            >
                                <Avatar className="h-8 w-8">
                                    <AvatarImage
                                        src={collaborator.user.avatar}
                                    />
                                    <AvatarFallback
                                        style={{
                                            backgroundColor:
                                                collaborator.user.color,
                                        }}
                                        className="text-white text-xs"
                                    >
                                        {collaborator.user.name
                                            .substring(0, 2)
                                            .toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm truncate">
                                        {collaborator.user.name}
                                    </div>
                                    {collaborator.user.email && (
                                        <div className="text-xs text-gray-500 truncate">
                                            {collaborator.user.email}
                                        </div>
                                    )}
                                </div>
                                <div
                                    className="w-3 h-3 rounded-full flex-shrink-0"
                                    style={{
                                        backgroundColor:
                                            collaborator.user.color,
                                    }}
                                />
                            </DropdownMenuItem>
                        ))
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
