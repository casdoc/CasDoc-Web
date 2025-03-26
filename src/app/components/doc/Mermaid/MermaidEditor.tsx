import mermaid from "mermaid";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import CodeMirror from "@uiw/react-codemirror";
import { cn } from "@/lib/utils";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import MermaidOptions from "./MermaidOptions";
import { Copy, Maximize2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
interface MermaidEditorProps {
    initialCode: string;
    onCodeUpdate?: (code: string) => void;
}
const MermaidEditor: React.FC<MermaidEditorProps> = ({
    initialCode,
    onCodeUpdate,
}) => {
    const diagramId = useRef(`mermaid-diagram-${uuidv4()}`);
    const [viewMode, setViewMode] = useState<"code" | "split" | "preview">(
        "split"
    );
    const [renderedSvg, setRenderedSvg] = useState("");
    const [error, setError] = useState("");
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const previewRef = useRef<HTMLDivElement>(null);
    const onCodeUpdateRef = useRef(onCodeUpdate);

    useEffect(() => {
        console.debug("MermaidEditor 刷新");

        mermaid.initialize({
            startOnLoad: false,
            theme: "neutral",
        });
    }, [initialCode]);

    // debounced render
    useEffect(() => {
        const timer = setTimeout(async () => {
            try {
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
        }, 300);
        return () => clearTimeout(timer);
    }, [initialCode]);

    const handleCopyCode = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            navigator.clipboard.writeText(initialCode).catch(() => {
                alert("複製失敗");
            });
        },
        [initialCode]
    );

    const handleOpenPanel = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setIsPanelOpen(true);
    }, []);

    const handleViewModeChange = useCallback(
        (value: "code" | "split" | "preview") => {
            setViewMode(value);
            console.debug("view mode changed", value);
        },
        []
    );
    const stopPropagation = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <div
            className="relative max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6"
            onClick={stopPropagation}
        >
            {/* top navigation */}
            <div
                className="flex justify-between items-center mb-6"
                onClick={stopPropagation}
            >
                <div className="flex items-center gap-3 pr-1">
                    <span className="font-bold text-gray-800 pr-4">
                        Mermaid
                    </span>
                    <Select
                        value={viewMode}
                        onValueChange={handleViewModeChange}
                    >
                        <SelectTrigger className="w-[100px] h-8 text-sm text-[#32363e] ">
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
                        className="h-9 w-9 text-[#32363e] hover:bg-slate-50 "
                        onClick={handleCopyCode}
                        title="複製程式碼"
                    >
                        <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-[#32363e] hover:bg-slate-50"
                        onClick={handleOpenPanel}
                        title="在面板中查看"
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
                            "border rounded-md  flex  justify-center items-center p-3 min-h-[200px] w-full"
                        )}
                        ref={previewRef}
                    >
                        {error ? (
                            <p className="text-red-400 text-center">{error}</p>
                        ) : (
                            <div
                                className="text-center"
                                dangerouslySetInnerHTML={{
                                    __html: renderedSvg,
                                }}
                            />
                        )}
                    </div>
                )}
            </div>

            <Sheet open={isPanelOpen} onOpenChange={setIsPanelOpen}>
                <SheetContent side="right" className="p-6 w-[500px] bg-white">
                    <SheetHeader>
                        <SheetTitle className="text-lg font-semibold">
                            Mermaid 預覽
                        </SheetTitle>
                        <SheetDescription className="text-sm text-gray-500">
                            在這裡查看 Mermaid 圖表的完整預覽
                        </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6 flex justify-center items-center">
                        {error ? (
                            <p className="text-red-500">{error}</p>
                        ) : (
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: renderedSvg,
                                }}
                            />
                        )}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default MermaidEditor;
