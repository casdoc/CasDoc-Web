import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useDocumentContext } from "@/app/viewModels/context/DocumentContext";
import { GraphNode } from "@/app/viewModels/useDocument";
import { CirclePlus, CircleMinus } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

// Updated advice interface with reason
interface Advice {
    id: string;
    reason: string;
}

interface AgentRelationAdviceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    advice?: Advice[]; // Changed to Advice array
    title?: string;
}

const AgentRelationAdviceDialog: React.FC<AgentRelationAdviceDialogProps> = ({
    open,
    onOpenChange,
    advice = [],
    title = "AI Advice",
}) => {
    const [loading, setLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const { graphNodes } = useDocumentContext();

    // For testing - remove this in production
    const mockAdvice: Advice[] = graphNodes.map((node: GraphNode) => ({
        id: node.id,
        reason: `This node seems to relate to the current context because of ${node.label} characteristics.`,
    }));
    advice = mockAdvice;

    useEffect(() => {
        if (open) {
            setLoading(true);
            const timer = setTimeout(() => {
                setLoading(false);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [open]);

    // Filter nodes that are in the advice list
    const adviceIds = advice.map((item) => item.id);
    const filteredNodes = graphNodes.filter(
        (node) => adviceIds.includes(node.id) || node.type.startsWith("topic")
    );

    // Group nodes by topics
    const topicNodes = filteredNodes.filter((node) =>
        node.type.startsWith("topic")
    );
    const templateNodes = filteredNodes.filter((node) =>
        node.type.startsWith("template-")
    );

    // Find reason for a node
    const getReasonForNode = (nodeId: string): string => {
        const adviceItem = advice.find((item) => item.id === nodeId);
        return adviceItem?.reason || "";
    };

    const toggleSelect = (id: string) => {
        setSelectedItems((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
                console.debug(`Removed node ${id} from selection`);
            } else {
                newSet.add(id);
                console.debug(`Added node ${id} to selection`);
            }
            return newSet;
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="sm:max-w-[500px] h-3/4"
                onClick={(e) => e.stopPropagation()}
            >
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        View AI-suggested connections between nodes.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="w-full pr-4 flex-1">
                    {loading ? (
                        <div className="space-y-4">
                            {/* Topic skeleton */}
                            <div>
                                <Skeleton className="h-6 w-[40%] mb-2" />
                                <div className="my-2 border-b-[1px] border-gray-300" />

                                {/* Template item skeletons */}
                                {[1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className="py-2 px-1 rounded mb-1"
                                    >
                                        <div className="flex items-center">
                                            <Skeleton className="h-5 w-5 rounded-full mr-2" />
                                            <div className="flex flex-1 justify-between items-center">
                                                <Skeleton className="h-4 w-[60%]" />
                                                <Skeleton className="h-5 w-[20%] rounded-md" />
                                            </div>
                                        </div>
                                        <div className="ml-7 mt-1">
                                            <Skeleton className="h-3 w-[85%]" />
                                            <Skeleton className="h-3 w-[70%] mt-1" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Another topic section */}
                            <div>
                                <Skeleton className="h-6 w-[50%] mb-2" />
                                <div className="my-2 border-b-[1px] border-gray-300" />

                                {/* Template item skeletons */}
                                {[1, 2].map((i) => (
                                    <div
                                        key={i}
                                        className="py-2 px-1 rounded mb-1"
                                    >
                                        <div className="flex items-center">
                                            <Skeleton className="h-5 w-5 rounded-full mr-2" />
                                            <div className="flex flex-1 justify-between items-center">
                                                <Skeleton className="h-4 w-[55%]" />
                                                <Skeleton className="h-5 w-[20%] rounded-md" />
                                            </div>
                                        </div>
                                        <div className="ml-7 mt-1">
                                            <Skeleton className="h-3 w-[80%]" />
                                            <Skeleton className="h-3 w-[75%] mt-1" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        topicNodes.map((topicNode) => (
                            <React.Fragment key={topicNode.id}>
                                <div className=" font-semibold mt-4 mb-2">
                                    {topicNode.label}
                                </div>
                                <div className="my-2 border-b-[1px] border-gray-300" />
                                {templateNodes
                                    .filter(
                                        (template) =>
                                            template.pid === topicNode.id
                                    )
                                    .map((template) => (
                                        <div
                                            key={template.id}
                                            className={`py-2 px-1 rounded mb-1 ${
                                                selectedItems.has(template.id)
                                                    ? "bg-green-100"
                                                    : ""
                                            }`}
                                        >
                                            <div className="flex items-center">
                                                <div
                                                    className="cursor-pointer mr-2"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleSelect(
                                                            template.id
                                                        );
                                                    }}
                                                >
                                                    <TooltipProvider>
                                                        {selectedItems.has(
                                                            template.id
                                                        ) ? (
                                                            <Tooltip>
                                                                <TooltipTrigger
                                                                    asChild
                                                                >
                                                                    <CircleMinus className="h-5 w-5 text-red-500" />
                                                                </TooltipTrigger>
                                                                <TooltipContent side="bottom">
                                                                    <p>
                                                                        Disconnect
                                                                    </p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        ) : (
                                                            <Tooltip>
                                                                <TooltipTrigger
                                                                    asChild
                                                                >
                                                                    <CirclePlus className="h-5 w-5 text-green-500" />
                                                                </TooltipTrigger>
                                                                <TooltipContent side="bottom">
                                                                    <p>
                                                                        Connect
                                                                    </p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        )}
                                                    </TooltipProvider>
                                                </div>
                                                <div className="flex flex-1 justify-between items-center">
                                                    <span>
                                                        {template.label}
                                                    </span>
                                                    <span
                                                        className={`text-xs px-2 py-1 rounded ${
                                                            selectedItems.has(
                                                                template.id
                                                            )
                                                                ? "bg-green-500 text-white"
                                                                : "bg-gray-200 text-gray-600"
                                                        }`}
                                                    >
                                                        {template.type.replace(
                                                            "template-",
                                                            ""
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-500 ml-7 mt-1">
                                                {getReasonForNode(template.id)}
                                            </div>
                                        </div>
                                    ))}
                            </React.Fragment>
                        ))
                    )}
                </ScrollArea>
                <div className="flex justify-between items-center mt-4 pt-2 border-t">
                    <div className="text-sm text-gray-500">
                        Selected: {selectedItems.size} item
                        {selectedItems.size !== 1 ? "s" : ""}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AgentRelationAdviceDialog;
