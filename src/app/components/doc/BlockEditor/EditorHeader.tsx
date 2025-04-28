"use client";

import { useCallback } from "react";
import DocMode from "@/app/models/enum/DocMode";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import ImportDialog from "../Dialog/ImportDialog";
import { Editor } from "@tiptap/core";
import ExportPopover from "../Popover/ExportPopover";
import {
    BotMessageSquare,
    FilePenLine,
    Network,
    SquareSplitHorizontal,
} from "lucide-react";
import { useChatContext } from "@/app/viewModels/context/ChatContext";
import SaveStatusBadge from "./SaveStatusBadge";
import SaveStatus from "@/app/models/enum/SaveStatus";

interface EditorHeaderProps {
    mode: DocMode;
    setDocMode: (newMode: DocMode) => void;
    editor: Editor;
    editorStatus: () => SaveStatus;
}

const EditorHeader = ({
    mode,
    setDocMode,
    editor,
    editorStatus,
}: EditorHeaderProps) => {
    const handleChangeView = useCallback(
        (newMode: DocMode) => {
            setDocMode(newMode);
        },
        [setDocMode]
    );
    const { isOpen, setIsOpen } = useChatContext();

    return (
        <div className="flex flex-row items-center justify-between flex-none py-2 px-3 text-black bg-white border-b border-neutral-200 dark:bg-black dark:text-white dark:border-neutral-800 z-50">
            {/* Left side with logo and mode buttons */}
            <div className="flex items-center gap-x-1.5">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <SidebarTrigger />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Sidebar</p>
                        </TooltipContent>
                    </Tooltip>
                    <div className="h-6 w-px mx-1 bg-neutral-200 dark:bg-neutral-800" />
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size="icon"
                                variant={
                                    mode === DocMode.Edit
                                        ? "secondary"
                                        : "ghost"
                                }
                                onClick={() => handleChangeView(DocMode.Edit)}
                            >
                                <FilePenLine />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Editor mode</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size="icon"
                                variant={
                                    mode === DocMode.Graph
                                        ? "secondary"
                                        : "ghost"
                                }
                                onClick={() => handleChangeView(DocMode.Graph)}
                            >
                                <Network
                                    style={{ transform: "rotate(270deg)" }}
                                />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Project Graph mode</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size="icon"
                                variant={
                                    mode === DocMode.Split
                                        ? "secondary"
                                        : "ghost"
                                }
                                onClick={() => handleChangeView(DocMode.Split)}
                            >
                                <SquareSplitHorizontal />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Split View mode</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                {/* Render the SaveStatusBadge without passing status */}
                <div className="ml-2">
                    {" "}
                    {/* Add some margin */}
                    <SaveStatusBadge
                        editorStatus={editorStatus} // Pass the function to get status
                    />
                </div>
            </div>

            {/* Right side with import button and guide button */}
            <div className="flex items-center gap-x-5 mr-3">
                <TooltipProvider>
                    <Button
                        variant="default"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <div className="flex items-center gap-3 px-1 select-none">
                            <BotMessageSquare color="#fafafa" />
                            <div className="text-neutral-50 font-semibold text-sm">
                                CasDoc Agent
                            </div>
                        </div>
                    </Button>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div>
                                <ImportDialog editor={editor} />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Import</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div>
                                <ExportPopover editor={editor} />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Export</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    );
};

export default EditorHeader;
