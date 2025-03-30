"use client";

import { useCallback } from "react";
import { Icon } from "@/app/components/doc/ui/Icon";
import DocMode from "@/app/models/enum/DocMode";
import LogoButton from "@/app/components/LogoButton";
import GuideButton from "@/app/components/guide/GuideButton";
import { Button } from "@/components/ui/button";

interface EditorHeaderProps {
    mode: DocMode;
    setDocMode: (newMode: DocMode) => void;
}

const EditorHeader = ({ mode, setDocMode }: EditorHeaderProps) => {
    const handleChangeView = useCallback(
        (newMode: DocMode) => {
            setDocMode(newMode);
        },
        [setDocMode]
    );
    return (
        <div className="flex flex-row items-center justify-between flex-none py-2 pl-6 pr-3 text-black bg-white border-b border-neutral-200 dark:bg-black dark:text-white dark:border-neutral-800 z-50">
            <div className="flex flex-row gap-x-1.5 items-center">
                <div className="flex items-center gap-x-1.5">
                    <LogoButton />
                    <Button
                        size="icon"
                        variant={mode === DocMode.Edit ? "secondary" : "ghost"}
                        onClick={() => handleChangeView(DocMode.Edit)}
                    >
                        <Icon name="FilePenLine" />
                    </Button>
                    <Button
                        size="icon"
                        variant={mode === DocMode.Graph ? "secondary" : "ghost"}
                        onClick={() => handleChangeView(DocMode.Graph)}
                    >
                        <Icon name="FolderTree" />
                    </Button>
                    <Button
                        size="icon"
                        variant={mode === DocMode.Split ? "secondary" : "ghost"}
                        onClick={() => handleChangeView(DocMode.Split)}
                    >
                        <Icon name="SquareSplitHorizontal" />
                    </Button>
                    <div className="absolute top-4 right-4">
                        <GuideButton />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditorHeader;
