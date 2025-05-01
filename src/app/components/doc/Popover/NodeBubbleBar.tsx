import React, {
    useRef,
    useReducer,
    useCallback,
    memo,
    useEffect,
    useState,
} from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Copy,
    Trash2,
    Pencil,
    ChevronDown,
    Bot,
    CirclePlus,
    BotMessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import useCustomNodeActions from "@/extensions/hooks/useCustomNodeActions";
import { Editor } from "@tiptap/core";
import AgentRelationAdviceDialog from "../Dialog/AgentRelationAdviceDialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useChatContext } from "@/app/viewModels/context/ChatContext";

// Define reducer action types
type BubbleAction =
    | { type: "TOGGLE" }
    | { type: "SET_OPEN"; payload: boolean }
    | { type: "COPY" }
    | { type: "EDIT" }
    | { type: "DELETE" };

// Define state interface
interface BubbleState {
    isOpen: boolean;
}

// Reducer function
const bubbleReducer = (
    state: BubbleState,
    action: BubbleAction
): BubbleState => {
    switch (action.type) {
        case "TOGGLE":
            return { ...state, isOpen: !state.isOpen };
        case "SET_OPEN":
            return { ...state, isOpen: action.payload };
        default:
            return state;
    }
};

interface NodeBubbleBarProps {
    id: string;
    selected: boolean;
    getPos: (() => number) | undefined;
    editor: Editor;
    initialOpen?: boolean;
}

const NodeBubbleBar: React.FC<NodeBubbleBarProps> = ({
    id,
    selected,
    getPos,
    editor,
    initialOpen = false,
}) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const [adviceDialogOpen, setAdviceDialogOpen] = useState(false);
    const { addNodeToAgent } = useChatContext();

    const [state, dispatch] = useReducer(bubbleReducer, {
        isOpen: initialOpen,
    });

    const { handleEdit, handleCopy, handleDelete, setNodeRef } =
        useCustomNodeActions({
            id,
            selected,
            getPos,
            editor,
        });

    const getNodeTitle = useCallback(() => {
        if (!getPos || !editor) return "Component";

        try {
            const pos = getPos();
            const node = editor.state.doc.nodeAt(pos);

            // Try to get title from different possible locations in the node
            if (node) {
                // Check common places where title might be stored
                if (node.attrs.title) return node.attrs.title;
                if (node.attrs.config?.info?.name)
                    return node.attrs.config.info.name;
                if (node.attrs.name) return node.attrs.name;
                if (node.attrs.label) return node.attrs.label;

                // If we have text content, use first few words
                if (node.textContent) {
                    const text = node.textContent.trim();
                    return text.length > 20
                        ? text.substring(0, 20) + "..."
                        : text;
                }
            }

            // Fallback
            return `Node ${id.substring(0, 6)}`;
        } catch {
            return `Node ${id.substring(0, 6)}`;
        }
    }, [id, getPos, editor]);

    // Open the bubble bar when the node is selected
    useEffect(() => {
        if (selected) {
            dispatch({ type: "SET_OPEN", payload: true });
        }
    }, [selected, setNodeRef]);

    useEffect(() => {
        setNodeRef(contentRef.current);
    }, [setNodeRef]);

    const handleOpenChange = useCallback((open: boolean) => {
        dispatch({ type: "SET_OPEN", payload: open });
    }, []);

    const onCopyClick = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            handleCopy();
            dispatch({ type: "SET_OPEN", payload: false });
        },
        [handleCopy]
    );

    const onEditClick = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            handleEdit();
            dispatch({ type: "SET_OPEN", payload: false });
        },
        [handleEdit]
    );

    const onDeleteClick = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            handleDelete();
            dispatch({ type: "SET_OPEN", payload: false });
        },
        [handleDelete]
    );

    const onAdviceClick = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            setAdviceDialogOpen(true);
            handleOpenChange(false);
        },
        [setAdviceDialogOpen, handleOpenChange]
    );

    const onAddToAgentClick = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            const title = getNodeTitle();
            addNodeToAgent(id, title);
            handleOpenChange(false);
        },
        [handleOpenChange, id, addNodeToAgent, getNodeTitle]
    );

    // Only render when selected
    if (!selected && !state.isOpen) {
        return null;
    }

    return (
        <div className="absolute right-2 -top-4 z-50">
            <Popover open={state.isOpen} onOpenChange={handleOpenChange}>
                {/* Invisible trigger element */}
                <PopoverTrigger asChild>
                    <div className="w-0 h-0 opacity-0 overflow-hidden" />
                </PopoverTrigger>
                <PopoverContent
                    ref={contentRef}
                    className="flex flex-row p-1 w-auto gap-1"
                    align="end"
                    sideOffset={5}
                    onOpenAutoFocus={(e) => e.preventDefault()} // Prevent autofocus on open
                >
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={onCopyClick}
                                    variant="ghost"
                                    className="focus:outline-none"
                                >
                                    <Copy size={16} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                                <p>Copy</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={onEditClick}
                                    variant="ghost"
                                    className="focus:outline-none"
                                >
                                    <Pencil size={16} />
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

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={onDeleteClick}
                                    variant="ghost"
                                    className="focus:outline-none"
                                >
                                    <Trash2 size={16} color="red" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                                <p>Delete</p>
                            </TooltipContent>
                        </Tooltip>

                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <div className="flex items-center gap-1 px-2">
                                    <Bot size={18} color="#3B9EFF" />
                                    <div className="text-[#3B9EFF] font-semibold text-sm">
                                        AI tools
                                    </div>
                                    <ChevronDown size={14} color="#3B9EFF" />
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent alignOffset={2}>
                                <DropdownMenuItem
                                    onClick={onAdviceClick}
                                    className="text-sm font-semibold text-gray-600"
                                >
                                    <CirclePlus className="h-5 w-5 text-gray-500" />
                                    Auto Connect
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={onAddToAgentClick}
                                    className="text-sm font-semibold text-gray-600"
                                >
                                    <BotMessageSquare className="h-5 w-5 text-gray-500" />
                                    Add to Agent
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TooltipProvider>
                </PopoverContent>
            </Popover>

            <AgentRelationAdviceDialog
                open={adviceDialogOpen}
                selectedNodeId={id}
                onOpenChange={setAdviceDialogOpen}
                title="AI Relationship Advice"
            />
        </div>
    );
};

// Use memo to prevent unnecessary re-renders
export default memo(NodeBubbleBar);
