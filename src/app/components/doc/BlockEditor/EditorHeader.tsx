"use client";

import { useCallback } from "react";
import { Icon } from "@/app/components/doc/ui/Icon";
import { Toolbar } from "@/app/components/doc/ui/Toolbar";
import DocMode from "@/app/models/enum/DocMode";
import LogoButton from "@/app/components/LogoButton";
import GuideButton from "@/app/components/guide/GuideButton";
import { SidebarTrigger } from "@/components/ui/sidebar";

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
                    <SidebarTrigger />
                    <LogoButton />
                    <Toolbar.Button
                        tooltip={"Editor mode"}
                        onClick={() => handleChangeView(DocMode.Edit)}
                        active={mode === DocMode.Edit}
                    >
                        <Icon name={"FilePenLine"} />
                    </Toolbar.Button>
                    <Toolbar.Button
                        tooltip={"Project Tree mode"}
                        onClick={() => handleChangeView(DocMode.Graph)}
                        active={mode === DocMode.Graph}
                    >
                        <Icon name={"FolderTree"} />
                    </Toolbar.Button>
                    <Toolbar.Button
                        tooltip={"Split View mode"}
                        onClick={() => handleChangeView(DocMode.Split)}
                        active={mode === DocMode.Split}
                    >
                        <Icon name={"SquareSplitHorizontal"} />
                    </Toolbar.Button>
                    <div className="absolute top-4 right-4">
                        <GuideButton />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditorHeader;
