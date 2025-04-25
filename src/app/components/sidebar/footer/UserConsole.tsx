import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const UserConsole = () => {
    return (
        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-200 transition cursor-pointer">
            <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                    <AvatarImage src="/user-avatar.png" alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="space-y-0.5">
                    <p className="text-sm font-medium leading-none">User</p>
                    <p className="text-xs text-muted-foreground">
                        user@email.com
                    </p>
                </div>
            </div>
            <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-red-500"
            >
                <LogOut className="h-4 w-4" />
            </Button>
        </div>
    );
};

export default UserConsole;
