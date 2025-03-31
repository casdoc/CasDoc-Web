"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { Editor } from "@tiptap/react";
import { useToast } from "@/hooks/use-toast";
import {
    MarkdownSerializer,
    defaultMarkdownSerializer,
} from "prosemirror-markdown";
import { Clapperboard, FileDown } from "lucide-react";

const ExportPopover = ({ editor }: { editor: Editor }) => {
    const { toast } = useToast();
    const [isExporting, setIsExporting] = useState(false);

    const handleExportMarkdown = async () => {
        if (!editor) return;
        setIsExporting(true);
        try {
            // Create custom serializer functions for each node type
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            type NodeSerializer = (state: any, node: any) => void;
            const nodes: { [key: string]: NodeSerializer } = {
                ...defaultMarkdownSerializer.nodes,
                // Custom serializer for topic node
                topic: (state, node) => {
                    const { config } = node.attrs;
                    const name = config?.info?.name || "Unknown";
                    const description = config?.info?.description || "";

                    // state.write(`:::topic\n`);
                    state.write(`## Name: ${name}\n`);
                    state.write(`Description: ${description}\n`);
                    // state.write(`:::\n\n`);
                },
            };

            // Add fallback serializers for any node types not handled
            Object.keys(editor.schema.nodes).forEach((nodeName) => {
                if (!nodes[nodeName]) {
                    nodes[nodeName] = (state, node) => {
                        // Default fallback just renders content
                        if (node.content) {
                            state.renderContent(node);
                        }
                    };
                }
            });

            // Create serializer with our custom nodes and default marks
            const serializer = new MarkdownSerializer(
                nodes,
                defaultMarkdownSerializer.marks
            );
            const markdown = serializer.serialize(editor.state.doc);

            // Create blob and download
            const blob = new Blob([markdown], {
                type: "text/markdown;charset=utf-8",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "document.md";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

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
        }
        setIsExporting(false);
    };

    const handleCopyMarkdown = async () => {
        if (!editor) return;
        setIsExporting(true);
        try {
            // Similar serialization as above
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            type NodeSerializer = (state: any, node: any) => void;
            const nodes: { [key: string]: NodeSerializer } = {
                ...defaultMarkdownSerializer.nodes,
                topic: (state, node) => {
                    const { config } = node.attrs;
                    const name = config?.info?.name || "Unknown";
                    const description = config?.info?.description || "";

                    state.write(`:::topic\n`);
                    state.write(`Name: ${name}\n`);
                    state.write(`Description: ${description}\n`);
                    state.write(`:::\n\n`);
                },
            };

            Object.keys(editor.schema.nodes).forEach((nodeName) => {
                if (!nodes[nodeName]) {
                    nodes[nodeName] = (state, node) => {
                        if (node.content) {
                            state.renderContent(node);
                        }
                    };
                }
            });

            const serializer = new MarkdownSerializer(
                nodes,
                defaultMarkdownSerializer.marks
            );
            const markdown = serializer.serialize(editor.state.doc);

            // Copy to clipboard instead of downloading
            await navigator.clipboard.writeText(markdown);

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
        }
        setIsExporting(false);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button size="icon" variant="ghost">
                    <FileDown />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-4">
                <div className="flex flex-col gap-y-2">
                    <Button
                        className="justify-start"
                        variant="outline"
                        onClick={handleExportMarkdown}
                        disabled={isExporting}
                    >
                        <FileDown className="mr-2" />
                        Export as Markdown
                    </Button>
                    <Button
                        className="justify-start"
                        variant="outline"
                        onClick={handleCopyMarkdown}
                        disabled={isExporting}
                    >
                        <Clapperboard className="mr-2" />
                        Copy as Markdown
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default ExportPopover;
