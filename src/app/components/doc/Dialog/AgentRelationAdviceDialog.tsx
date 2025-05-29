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
import { CirclePlus, CircleMinus } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import {
    AgentService,
    StreamResponse,
} from "@/app/models/services/AgentService";

// Updated advice interface with reason
interface Advice {
    source: string;
    target: string;
    data: {
        bidirectional: boolean;
        reason: string;
    };
}

interface AgentRelationAdviceDialogProps {
    open: boolean;
    selectedComponentId: string;
    onOpenChange: (open: boolean) => void;
    title?: string;
    projectId: string; // Add projectId prop
}

const AgentRelationAdviceDialog = ({
    open,
    selectedComponentId = "4a86e673-b270-4ff8-92ed-784af7652c7b", // Default to a specific ID for testing
    onOpenChange,
    title = "Relation Advices",
    projectId,
}: AgentRelationAdviceDialogProps) => {
    const [loading, setLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [advice, setAdvice] = useState<Advice[]>([]);
    // const {
    //     updConnectionEdges,
    //     removeConnectionEdge,
    //     parseAttachedDocsToNodes,
    // } = useGraphContext();
    // For testing - remove this in production
    // const graphNodes = parseAttachedDocsToNodes();
    // const mockAdvice: Advice[] = graphNodes.map((node: GraphNode) => ({
    //     id: node.id,
    //     reason: `This node seems to relate to the current context because of ${node.label} characteristics.`,
    // }));
    // advice = mockAdvice;

    useEffect(() => {
        if (open) {
            setLoading(true);

            // Call the connect API
            AgentService.connect(selectedComponentId, projectId)
                .then((response) => {
                    if (response) {
                        return AgentService.handleStreamResponse(
                            response,
                            undefined,
                            (message: StreamResponse) => {
                                // Process each message as it comes in
                                if (message.event === "final_answer") {
                                    setAdvice(message.data?.connections || []);
                                }
                            },
                            (error: Error) => {
                                console.error(
                                    "Error in stream response:",
                                    error
                                );
                                setLoading(false);
                            },
                            () => {
                                setLoading(false);
                            }
                        );
                    }
                    return null;
                })
                .catch((error) => {
                    console.error("Error fetching advice:", error);
                    setLoading(false);
                });
        }
    }, [open, selectedComponentId, projectId]);

    useEffect(() => {
        console.debug("Advice:", advice);
    }, [advice]);

    // Filter nodes that are in the advice list
    // const adviceIds = advice.map((item) => item.id);
    // const filteredNodes = graphNodes.filter(
    //     (node) => adviceIds.includes(node.id) || node.type.startsWith("topic")
    // );

    // Group nodes by topics
    // const topicNodes = filteredNodes.filter((node) =>
    //     node.type.startsWith("topic")
    // );
    // const templateNodes = filteredNodes.filter((node) =>
    //     node.type.startsWith("template-")
    // );

    // Find reason for a node
    // const getReasonForNode = (nodeId: string): string => {
    //     const adviceItem = advice.find((item) => item.id === nodeId);
    //     return adviceItem?.reason || "";
    // };
    const hadleConnet = (id: string) => {
        // const newEdge: ConnectionEdge = {
        //     source: selectedComponentId,
        //     target: id,
        //     label: "",
        //     data: { bidirectional: false },
        // };
        // updConnectionEdges(newEdge);
    };

    const handleDisconnect = (id: string) => {
        // const deleteEdge: ConnectionEdge = {
        //     source: selectedComponentId,
        //     target: id,
        //     label: "",
        //     data: { bidirectional: false },
        // };
        // removeConnectionEdge(deleteEdge);
    };

    const toggleSelect = (id: string) => {
        const isCurrentlySelected = selectedItems.has(id);

        // Update the selected items state
        setSelectedItems((prev) => {
            const newSet = new Set(prev);
            if (isCurrentlySelected) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });

        // Perform the appropriate connection action outside the state update
        if (isCurrentlySelected) {
            handleDisconnect(id);
        } else {
            hadleConnet(id);
        }
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
                        View AI-suggested connections between components.
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
                        <div>
                            {advice.map((connection: Advice) => (
                                <div
                                    key={connection.target}
                                    className={`py-2 px-1 rounded mb-1 ${
                                        selectedItems.has(connection.target)
                                            ? "bg-green-100"
                                            : ""
                                    }`}
                                >
                                    <div className="flex items-center">
                                        <div
                                            className="cursor-pointer mr-2"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleSelect(connection.target);
                                            }}
                                        >
                                            <TooltipProvider>
                                                {selectedItems.has(
                                                    connection.target
                                                ) ? (
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <CircleMinus className="h-5 w-5 text-red-500" />
                                                        </TooltipTrigger>
                                                        <TooltipContent side="bottom">
                                                            <p>Disconnect</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                ) : (
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <CirclePlus className="h-5 w-5 text-green-500" />
                                                        </TooltipTrigger>
                                                        <TooltipContent side="bottom">
                                                            <p>Connect</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                )}
                                            </TooltipProvider>
                                        </div>
                                        <div className="flex flex-1 justify-between items-center">
                                            <span>{connection.target}</span>
                                            <span
                                                className={`text-xs px-2 py-1 rounded ${
                                                    selectedItems.has(
                                                        connection.target
                                                    )
                                                        ? "bg-green-500 text-white"
                                                        : "bg-gray-200 text-gray-600"
                                                }`}
                                            >
                                                {connection.data.bidirectional
                                                    ? "Bidirectional"
                                                    : "Unidirectional"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500 ml-7 mt-1">
                                        {connection.data.reason}
                                    </div>
                                </div>
                            ))}
                        </div>
                        // topicNodes.map((topicNode) => {
                        //     const topicTemplates = templateNodes.filter(
                        //         (template) =>
                        //             template.pid === topicNode.id &&
                        //             template.id !== selectedComponentId
                        //     );
                        //     if (topicTemplates.length === 0) return null; // Skip if no templates under this topic
                        //     return (
                        // <React.Fragment key={topicNode.id}>
                        //     <div className=" font-semibold mt-4 mb-2">
                        //         {topicNode.label}
                        //     </div>
                        //     <div className="my-2 border-b-[1px] border-gray-300" />
                        //     {templateNodes
                        //         .filter(
                        //             (template) =>
                        //                 template.pid === topicNode.id &&
                        //                 template.id !== selectedComponentId
                        //         )
                        //         .map((template) => (
                        //             <div
                        //                 key={template.id}
                        //                 className={`py-2 px-1 rounded mb-1 ${
                        //                     selectedItems.has(
                        //                         template.id
                        //                     )
                        //                         ? "bg-green-100"
                        //                         : ""
                        //                 }`}
                        //             >
                        //                 <div className="flex items-center">
                        //                     <div
                        //                         className="cursor-pointer mr-2"
                        //                         onClick={(e) => {
                        //                             e.stopPropagation();
                        //                             toggleSelect(
                        //                                 template.id
                        //                             );
                        //                         }}
                        //                     >
                        //                         <TooltipProvider>
                        //                             {selectedItems.has(
                        //                                 template.id
                        //                             ) ? (
                        //                                 <Tooltip>
                        //                                     <TooltipTrigger
                        //                                         asChild
                        //                                     >
                        //                                         <CircleMinus className="h-5 w-5 text-red-500" />
                        //                                     </TooltipTrigger>
                        //                                     <TooltipContent side="bottom">
                        //                                         <p>
                        //                                             Disconnect
                        //                                         </p>
                        //                                     </TooltipContent>
                        //                                 </Tooltip>
                        //                             ) : (
                        //                                 <Tooltip>
                        //                                     <TooltipTrigger
                        //                                         asChild
                        //                                     >
                        //                                         <CirclePlus className="h-5 w-5 text-green-500" />
                        //                                     </TooltipTrigger>
                        //                                     <TooltipContent side="bottom">
                        //                                         <p>
                        //                                             Connect
                        //                                         </p>
                        //                                     </TooltipContent>
                        //                                 </Tooltip>
                        //                             )}
                        //                         </TooltipProvider>
                        //                     </div>
                        //                     <div className="flex flex-1 justify-between items-center">
                        //                         <span>
                        //                             {template.label}
                        //                         </span>
                        //                         <span
                        //                             className={`text-xs px-2 py-1 rounded ${
                        //                                 selectedItems.has(
                        //                                     template.id
                        //                                 )
                        //                                     ? "bg-green-500 text-white"
                        //                                     : "bg-gray-200 text-gray-600"
                        //                             }`}
                        //                         >
                        //                             {template.type.replace(
                        //                                 "template-",
                        //                                 ""
                        //                             )}
                        //                         </span>
                        //                     </div>
                        //                 </div>
                        //                 <div className="text-xs text-gray-500 ml-7 mt-1">
                        //                     {getReasonForNode(
                        //                         template.id
                        //                     )}
                        //                 </div>
                        //             </div>
                        //         ))}
                        // </React.Fragment>
                        //     );
                        // })
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
