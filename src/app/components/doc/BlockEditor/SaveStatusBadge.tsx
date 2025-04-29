import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Loader2, Check, Wifi, AlertCircle } from "lucide-react";
import SaveStatus from "@/app/models/enum/SaveStatus";

interface SaveStatusBadgeProps {
    editorStatus: () => SaveStatus;
}
const SaveStatusBadge = ({ editorStatus }: SaveStatusBadgeProps) => {
    const getStatusContent = () => {
        // Use the calculated currentStatus
        switch (editorStatus()) {
            case SaveStatus.Connecting:
                return {
                    icon: <Wifi className="h-3 w-3 mr-1" />,
                    text: "Connecting",
                    variant: "outline",
                    className: "text-blue-600 border-blue-200",
                };
            case SaveStatus.Saving:
                return {
                    icon: <Loader2 className="h-3 w-3 mr-1 animate-spin" />,
                    text: "Saving...",
                    variant: "outline",
                    className: "text-yellow-600 border-yellow-200",
                };
            case SaveStatus.Saved:
                return {
                    icon: <Check className="h-3 w-3 mr-1" />,
                    text: "Saved",
                    variant: "outline",
                    className: "text-green-600 border-green-200",
                };
            case SaveStatus.Error:
                return {
                    icon: <AlertCircle className="h-3 w-3 mr-1" />,
                    text: "Error",
                    variant: "destructive",
                    className: "text-red-600 border-red-200",
                };
            case SaveStatus.Idle:
            default:
                return null;
        }
    };

    const content = getStatusContent();

    if (!content) {
        return null; // Don't render anything if idle or default
    }

    return (
        <Badge
            variant={null}
            className={cn(
                "flex items-center text-xs px-2 py-0.5",
                content.className
            )}
        >
            {content.icon}
            <span>{content.text}</span>
        </Badge>
    );
};

export default SaveStatusBadge;
