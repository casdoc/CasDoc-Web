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
import { Copy, Trash2, Pencil, BrainCircuit } from "lucide-react";
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

    // Open the bubble bar when the node is selected
    useEffect(() => {
        if (selected) {
            dispatch({ type: "SET_OPEN", payload: true });
        } else {
            console.debug("not selected");
            // dispatch({ type: "SET_OPEN", payload: false });
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

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={onAdviceClick}
                                    variant="ghost"
                                    className="focus:outline-none"
                                >
                                    <BrainCircuit size={20} color="blue" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                                <p>Auto relateion</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </PopoverContent>
            </Popover>

            <AgentRelationAdviceDialog
                open={adviceDialogOpen}
                onOpenChange={setAdviceDialogOpen}
                title="AI Relationship Advice"
            />
        </div>
    );
};

// Use memo to prevent unnecessary re-renders
export default memo(NodeBubbleBar);
