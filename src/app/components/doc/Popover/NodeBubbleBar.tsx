import React, { useRef } from "react";
import {
    Popover,
    PopoverContent,
    PopoverAnchor,
} from "@/components/ui/popover";
import { Copy, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface NodeBubbleBarProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCopy?: () => void;
    onDelete?: () => void;
    onEdit?: () => void;
}

const NodeBubbleBar: React.FC<NodeBubbleBarProps> = ({
    open,
    onOpenChange,
    onCopy,
    onDelete,
    onEdit,
}) => {
    const contentRef = useRef<HTMLDivElement>(null);

    return (
        <Popover open={open} onOpenChange={onOpenChange}>
            <PopoverAnchor className="absolute -top-2 right-20 -translate-x-1/2 " />
            <PopoverContent
                ref={contentRef}
                className="flex flex-row p-1 w-auto gap-1"
                align="start"
                sideOffset={-100}
                onOpenAutoFocus={(e) => e.preventDefault()} // Prevent autofocus on open
            >
                <TooltipProvider>
                    {onCopy && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onCopy();
                                        onOpenChange(false);
                                    }}
                                    variant="ghost"
                                    className="focus:outline-none"
                                >
                                    <Copy size={16} />
                                    {/* <span className="text-sm">Copy</span> */}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                                <p>Copy</p>
                            </TooltipContent>
                        </Tooltip>
                    )}
                    {onEdit && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit();
                                        onOpenChange(false);
                                    }}
                                    variant="ghost"
                                    className="focus:outline-none"
                                >
                                    <Pencil size={16} />
                                    {/* <span className="text-sm">Edit</span> */}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                                <p>
                                    Edit (
                                    {typeof window !== "undefined" &&
                                    /Mac/.test(navigator.platform)
                                        ? "Cmd"
                                        : "Ctrl"}{" "}
                                    + Enter)
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    )}
                    {onDelete && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete();
                                        onOpenChange(false);
                                    }}
                                    variant="ghost"
                                    className="focus:outline-none"
                                >
                                    <Trash2 size={16} color="red" />
                                    {/* <span className="text-sm">Delete</span> */}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                                <p>Delete</p>
                            </TooltipContent>
                        </Tooltip>
                    )}
                </TooltipProvider>
            </PopoverContent>
        </Popover>
    );
};

export default NodeBubbleBar;
