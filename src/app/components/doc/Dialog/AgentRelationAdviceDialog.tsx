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
import { GraphNode } from "@/app/viewModels/GraphViewModel";
import { CirclePlus, CircleMinus } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGraphContext } from "@/app/viewModels/context/GraphContext";
import { ConnectionEdge } from "@/app/viewModels/GraphViewModel";

// Updated advice interface with reason
interface Advice {
    id: string;
    reason: string;
}

interface AgentRelationAdviceDialogProps {
    open: boolean;
    selectedNodeId: string;
    onOpenChange: (open: boolean) => void;
    advice?: Advice[];
    title?: string;
}
const mockAdvice: Advice[] = [
    {
        id: "f1074f24-ce0c-4eed-9de4-54a006db3b04", // Review data schema
        reason: "評論資料與使用者的資料密切相關，因為每個評論都會與使用者進行關聯，並且需要記錄使用者的 id。",
    },
    {
        id: "2f8e6f4a-384c-412a-b924-5cbbcc1dc7f6", // Dish data schema
        reason: "使用者可能會與菜品相關聯，透過訂單選擇菜品來生成評論，因此需要關聯使用者資料。",
    },
    {
        id: "9bbf58ae-d7e5-4956-af0b-c3f350a37762", // AttributeOption data schema
        reason: "這些細項選項資料與使用者的點餐選擇有關，可能會影響使用者對菜品的選擇，因此與使用者資料相關。",
    },
    {
        id: "c1c1ac82-c10c-4cd0-a870-cf1bcc1ac82a", // Forgot Password API Interface
        reason: "該 API 與使用者資料相關，因為使用者需要通過其電子郵件來重設密碼。",
    },
    {
        id: "33e4cbc8-45c7-4bbe-89e4-ba4f1bcdb7dd", // Register API Interface
        reason: "註冊 API 涉及使用者基本資料的輸入，包括姓名、電子郵件、密碼等，與使用者資料直接關聯。",
    },
    {
        id: "69a0ce14-3a01-46ef-b063-15b64806eaf5", // Update Profile API Interface
        reason: "此 API 允許使用者更新其個人資料，直接操作使用者資料結構中的欄位。",
    },
    {
        id: "8efeb382-472b-4754-873e-0a1a8892a851", // Get User Info API Interface
        reason: "此 API 查詢使用者的基本資料，與 `User` 資料結構的所有欄位相關聯。",
    },
    {
        id: "5759e317-babd-4dc1-8ec4-195f6c1ac0b7", // Menu data schema
        reason: "菜單資料與使用者互動密切，使用者選擇菜品後需要關聯到該菜品資料。",
    },
    {
        id: "2a0a080f-a4da-44a3-950a-64eab7d57b6f", // Order data schema
        reason: "訂單資料與使用者直接相關，因為每筆訂單會對應到一個使用者。",
    },
    {
        id: "f6b4928a-b4b1-4aba-95fd-9641314e4794", // User API Interface
        reason: "該 API 主要用於操作與使用者資料有關的所有資料，直接與 `User` 資料結構關聯。",
    },
];

const AgentRelationAdviceDialog = ({
    open,
    selectedNodeId,
    onOpenChange,
    advice = mockAdvice,
    title = "Relation Advices",
}: AgentRelationAdviceDialogProps) => {
    const [loading, setLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const {
        updConnectionEdges,
        removeConnectionEdge,
        parseAttachedDocsToNodes,
    } = useGraphContext();
    // For testing - remove this in production
    const graphNodes = parseAttachedDocsToNodes();
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
    const hadleConnet = (id: string) => {
        const newEdge: ConnectionEdge = {
            source: selectedNodeId,
            target: id,
            label: "",
            data: { bidirectional: false },
        };

        updConnectionEdges(newEdge);
    };

    const handleDisconnect = (id: string) => {
        const deleteEdge: ConnectionEdge = {
            source: selectedNodeId,
            target: id,
            label: "",
            data: { bidirectional: false },
        };
        removeConnectionEdge(deleteEdge);
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
                        topicNodes.map((topicNode) => {
                            const topicTemplates = templateNodes.filter(
                                (template) =>
                                    template.pid === topicNode.id &&
                                    template.id !== selectedNodeId
                            );
                            if (topicTemplates.length === 0) return null; // Skip if no templates under this topic
                            return (
                                <React.Fragment key={topicNode.id}>
                                    <div className=" font-semibold mt-4 mb-2">
                                        {topicNode.label}
                                    </div>
                                    <div className="my-2 border-b-[1px] border-gray-300" />
                                    {templateNodes
                                        .filter(
                                            (template) =>
                                                template.pid === topicNode.id &&
                                                template.id !== selectedNodeId
                                        )
                                        .map((template) => (
                                            <div
                                                key={template.id}
                                                className={`py-2 px-1 rounded mb-1 ${
                                                    selectedItems.has(
                                                        template.id
                                                    )
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
                                                    {getReasonForNode(
                                                        template.id
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                </React.Fragment>
                            );
                        })
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
