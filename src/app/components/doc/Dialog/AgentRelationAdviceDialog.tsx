import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

interface AgentRelationAdviceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    advice?: string | React.ReactNode;
    title?: string;
}

const AgentRelationAdviceDialog: React.FC<AgentRelationAdviceDialogProps> = ({
    open,
    onOpenChange,
    advice,
    title = "AI Advice",
}) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (open) {
            setLoading(true);
            const timer = setTimeout(() => {
                setLoading(false);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[300px] w-full pr-4">
                    {loading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-[90%]" />
                            <Skeleton className="h-4 w-[95%]" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-[85%]" />
                            <Skeleton className="h-4 w-[90%]" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                    ) : (
                        <div className="p-1">
                            {advice || "No advice available."}
                        </div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default AgentRelationAdviceDialog;
