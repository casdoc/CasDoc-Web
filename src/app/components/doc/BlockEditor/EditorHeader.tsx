"use client";

import { useCallback, useState } from "react";
import { Icon } from "@/app/components/doc/ui/Icon";
import DocMode from "@/app/models/enum/DocMode";
import LogoButton from "@/app/components/LogoButton";
import GuideButton from "@/app/components/guide/GuideButton";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface EditorHeaderProps {
    mode: DocMode;
    setDocMode: (newMode: DocMode) => void;
}

const EditorHeader = ({ mode, setDocMode }: EditorHeaderProps) => {
    const [importDialogOpen, setImportDialogOpen] = useState(false);

    const handleChangeView = useCallback(
        (newMode: DocMode) => {
            setDocMode(newMode);
        },
        [setDocMode]
    );

    return (
        <div className="flex flex-row items-center justify-between flex-none py-2 pl-6 pr-3 text-black bg-white border-b border-neutral-200 dark:bg-black dark:text-white dark:border-neutral-800 z-50">
            {/* Left side with logo and mode buttons */}
            <div className="flex items-center gap-x-1.5">
                <LogoButton />
                <TooltipProvider>
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
                                <Icon name="FilePenLine" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Editor mode</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
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
                                <Icon name="FolderTree" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Project Graph mode</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
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
                                <Icon name="SquareSplitHorizontal" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Split View mode</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            {/* Right side with import button and guide button */}
            <div className="flex items-center gap-x-4">
                <Dialog
                    open={importDialogOpen}
                    onOpenChange={setImportDialogOpen}
                >
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DialogTrigger asChild>
                                    <Button size="icon" variant="default">
                                        <Icon name="FileUp" />
                                    </Button>
                                </DialogTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Import</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Import Content</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col gap-y-2 pt-2">
                            <Button
                                className="justify-start"
                                variant="outline"
                                onClick={() => {}}
                            >
                                <Icon name="FileText" className="mr-2" />
                                Import from Markdown
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
                <GuideButton />
            </div>
        </div>
    );
};

export default EditorHeader;
