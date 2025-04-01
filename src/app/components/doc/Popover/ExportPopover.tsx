"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Icon } from "@/app/components/doc/ui/Icon";
import { Editor } from "@tiptap/react";
import { useToast } from "@/hooks/use-toast";
import {
    getMarkdown,
    downloadMarkdown,
    copyMarkdownToClipboard,
} from "@/lib/markdownExport";
const ExportPopover = ({ editor }: { editor: Editor }) => {
    const { toast } = useToast();
    const [isExporting, setIsExporting] = useState(false);

    const handleExportMarkdown = async () => {
        if (!editor) return;
        setIsExporting(true);
        try {
            const markdown = getMarkdown(editor);
            downloadMarkdown(markdown);

            toast({
                title: "Export Successful",
                description: "Document exported as Markdown",
            });
        } catch (error) {
            console.error("Export Markdown Error:", error);
            toast({
                title: "Export Failed",
                description: "Error exporting document as Markdown",
                variant: "destructive",
            });
        } finally {
            setIsExporting(false);
        }
    };

    const handleCopyMarkdown = async () => {
        if (!editor) return;
        setIsExporting(true);

        try {
            const markdown = getMarkdown(editor);
            await copyMarkdownToClipboard(markdown);

            toast({
                title: "Copied to Clipboard",
                description: "Markdown content copied to clipboard",
            });
        } catch (error) {
            console.error("Copy Markdown Error:", error);
            toast({
                title: "Copy Failed",
                description: "Error copying Markdown to clipboard",
                variant: "destructive",
            });
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button size="icon" variant="outline">
                    <Icon name="Download" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="p-4"
                align="end"
                alignOffset={-5}
                sideOffset={5}
            >
                <div className="flex flex-col gap-y-2">
                    <Button
                        className="justify-start"
                        variant="outline"
                        onClick={handleExportMarkdown}
                        disabled={isExporting}
                    >
                        <Icon name="FileDown" className="mr-2" />
                        Export as Markdown
                    </Button>
                    <Button
                        className="justify-start"
                        variant="outline"
                        onClick={handleCopyMarkdown}
                        disabled={isExporting}
                    >
                        <Icon name="Clipboard" className="mr-2" />
                        Copy as Markdown
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default ExportPopover;
