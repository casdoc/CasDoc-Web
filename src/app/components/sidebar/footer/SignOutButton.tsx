import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Flex } from "@radix-ui/themes";
import { useState } from "react";

const SignOutButton = ({
    open,
    setOpen,
    signOut,
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    signOut: () => void;
}) => {
    const [onSignOut, setOnSignOut] = useState(false);

    const handleSignOut = () => {
        signOut();
        setOnSignOut(true);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-red-500"
                >
                    <LogOut className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <Flex direction="column" align="center" className="gap-12">
                    <DialogHeader>
                        <DialogTitle className="text-center">
                            Are you sure you want to sign out?
                        </DialogTitle>
                    </DialogHeader>
                    <Flex
                        direction="column"
                        align="center"
                        className="w-full gap-3"
                    >
                        <Button
                            variant="outline"
                            className="w-2/3 hover:bg-gray-200"
                            onClick={handleSignOut}
                        >
                            {onSignOut ? "Processing..." : "Sign Out"}
                        </Button>
                        <Button
                            variant="outline"
                            className="w-2/3 bg-blue-400 text-white hover:bg-blue-500 hover:text-white"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                    </Flex>
                </Flex>
            </DialogContent>
        </Dialog>
    );
};

export default SignOutButton;
