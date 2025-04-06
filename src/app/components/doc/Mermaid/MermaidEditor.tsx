import CodeMirror from "@uiw/react-codemirror";
import mermaid from "mermaid";
import MermaidPreview from "./MermaidPreview";
import MermaidOptions from "./MermaidOptions";
import { useCallback, useEffect, useRef, useState } from "react";
import { CheckCheck, Copy, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@radix-ui/themes";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface MermaidEditorProps {
    name?: string;
    initialCode: string;
    onCodeUpdate?: (code: string) => void;
}
const MermaidEditor: React.FC<MermaidEditorProps> = ({
    name,
    initialCode,
    onCodeUpdate,
}) => {
    const diagramId = useRef(`mermaid-diagram-${uuidv4()}`);
    const previewRef = useRef<HTMLDivElement>(null);
    const onCodeUpdateRef = useRef(onCodeUpdate);
    const [error, setError] = useState("");
    const [leftWidth, setLeftWidth] = useState(50);
    const [renderedSvg, setRenderedSvg] = useState("");
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const [viewMode, setViewMode] = useState<"code" | "split" | "preview">(
        "split"
    );

    // debounced render
    useEffect(() => {
        const timer = setTimeout(async () => {
            try {
                if (!initialCode) {
                    setRenderedSvg("");
                    setError("");
                    return;
                }
                //check if initialCode is valid mermaid code
                await mermaid.parse(initialCode);

                const { svg } = await mermaid.render(
                    diagramId.current,
                    initialCode
                );

                setRenderedSvg(svg);
                setError("");
            } catch {
                setError("error rendering mermaid diagram");
                setRenderedSvg("");
            }
        }, 1000);
        return () => clearTimeout(timer);
    }, [initialCode]);

    const stopPropagation = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (e.nativeEvent.stopImmediatePropagation) {
            e.nativeEvent.stopImmediatePropagation();
        }
        (
            e.nativeEvent as MouseEvent & { __handledByEditor?: boolean }
        ).__handledByEditor = true;
    };
    const handleCopyCode = useCallback(
        (e: React.MouseEvent) => {
            stopPropagation(e);
            navigator.clipboard.writeText(initialCode).then(() => {
                setCopySuccess(true);
                setTimeout(() => {
                    setCopySuccess(false);
                }, 2000); // Reset after 2 seconds
            });
        },
        [initialCode]
    );

    const handleOpenPanel = useCallback((e: React.MouseEvent) => {
        stopPropagation(e);
        setIsPanelOpen(true);
    }, []);

    const handleViewModeChange = useCallback(
        (value: "code" | "split" | "preview") => {
            setViewMode(value);
        },
        []
    );

    const handleMouseDown = useCallback(
        (e: React.MouseEvent) => {
            const startX = e.clientX;
            const startWidth = leftWidth;

            const handleMouseMove = (e: MouseEvent) => {
                const deltaX = e.clientX - startX;
                const newWidth =
                    startWidth + (deltaX / window.innerWidth) * 100;
                // limit width between 20% and 80%
                if (newWidth >= 20 && newWidth <= 80) {
                    setLeftWidth(newWidth);
                }
            };

            const handleMouseUp = () => {
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
            };

            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        },
        [leftWidth]
    );

    return (
        <div className="relative max-w-4xl min-w-60 mx-auto bg-white border rounded-lg p-4">
            {/* top navigation */}
            <div className="flex flex-wrap justify-between items-center mb-6">
                <div className="flex items-center gap-3 pr-1">
                    <span className="font-bold text-gray-800 pr-4">{name}</span>
                    <Select
                        value={viewMode}
                        onValueChange={handleViewModeChange}
                    >
                        <SelectTrigger
                            className="w-[100px] h-8 text-sm text-[#32363e] "
                            onClick={stopPropagation}
                        >
                            <SelectValue placeholder={viewMode} />
                        </SelectTrigger>
                        <SelectContent className=" text-[#32363e] ">
                            <SelectItem value="code">code</SelectItem>
                            <SelectItem value="split">split</SelectItem>
                            <SelectItem value="preview">preview</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCopyCode}
                        title={copySuccess ? "Copied!" : "Copy code"}
                    >
                        {copySuccess ? (
                            <CheckCheck className="h-4 w-4 text-green-500" />
                        ) : (
                            <Copy className="h-4 w-4" />
                        )}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-[#32363e] hover:bg-slate-50"
                        onClick={handleOpenPanel}
                        title="open in panel"
                    >
                        <Maximize2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* editor and preview */}
            <div
                className={cn(
                    viewMode === "split" ? "flex flex-col gap-2" : "",
                    viewMode === "code" || viewMode === "preview" ? "block" : ""
                )}
                onClick={stopPropagation}
            >
                {viewMode !== "preview" && (
                    <div
                        className={cn(
                            "border border-gray-600 rounded-md bg-[#282c34] p-2 w-full hover:cursor-text"
                        )}
                        onClick={stopPropagation}
                    >
                        <CodeMirror
                            value={initialCode}
                            minHeight="100px"
                            basicSetup={{
                                lineNumbers: true,
                                highlightActiveLine: true,
                            }}
                            extensions={MermaidOptions}
                            theme="dark"
                            onChange={(value: string) =>
                                onCodeUpdateRef.current?.(value)
                            }
                            onClick={stopPropagation}
                        />
                    </div>
                )}
                {viewMode !== "code" && (
                    <div
                        className={cn(
                            "border rounded-md  flex  justify-center items-center h-[400px]  w-full"
                        )}
                        ref={previewRef}
                    >
                        {error ? (
                            <p className="text-red-400 text-center">{error}</p>
                        ) : (
                            <MermaidPreview renderedSvg={renderedSvg} />
                        )}
                    </div>
                )}
            </div>

            {/*full size editor panel */}
            <Dialog open={isPanelOpen} onOpenChange={setIsPanelOpen}>
                <VisuallyHidden>
                    <DialogTitle>Mermaid</DialogTitle>
                    <DialogDescription>
                        Full-screen mermaid diagram editor with code and preview
                        panels
                    </DialogDescription>
                </VisuallyHidden>
                <DialogContent className="min-w-full w-full h-full p-0 [&>button[type='button']]:hidden">
                    <div className="flex flex-col h-full">
                        <div
                            className="flex justify-between items-center p-2 border-b"
                            onClick={stopPropagation}
                        >
                            <span className="font-bold text-gray-800 px-4">
                                Mermaid Editor
                            </span>
                            <div className="flex gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleCopyCode}
                                    title={
                                        copySuccess ? "Copied!" : "Copy code"
                                    }
                                >
                                    {copySuccess ? (
                                        <CheckCheck className="h-4 w-4 text-green-500" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                </Button>
                                <DialogClose onClick={stopPropagation}>
                                    <div className="hover:bg-accent h-8 px-2 py-2 rounded-md flex justify-center items-center">
                                        <Minimize2 className="h-4 w-4 " />
                                    </div>
                                </DialogClose>
                            </div>
                        </div>

                        <div className="flex flex-1 h-full ">
                            <div
                                style={{
                                    width: `${leftWidth}%`,
                                    minWidth: "200px",
                                    maxWidth: "80%",
                                    height: "100%",
                                }}
                                className="bg-[#282c34] relative rounded-bl-md "
                            >
                                <div className="absolute w-full h-full overflow-y-auto ">
                                    <CodeMirror
                                        value={initialCode}
                                        height="100%"
                                        width="100%"
                                        basicSetup={{
                                            lineNumbers: true,
                                            highlightActiveLine: true,
                                        }}
                                        extensions={MermaidOptions}
                                        theme="dark"
                                        onChange={(value: string) =>
                                            onCodeUpdateRef.current?.(value)
                                        }
                                    />
                                </div>
                            </div>
                            {/*  Divider */}
                            <div
                                className="w-2 bg-gray-200 hover:bg-gray-300 cursor-col-resize"
                                onMouseDown={handleMouseDown}
                            ></div>
                            {/*  Mermaid preview */}
                            <div
                                style={{ width: `${100 - leftWidth}%` }}
                                className="overflow-auto flex justify-center items-center"
                            >
                                {error ? (
                                    <p className="text-red-500">{error}</p>
                                ) : (
                                    <MermaidPreview renderedSvg={renderedSvg} />
                                )}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default MermaidEditor;
