import MermaidViewModel from "@/app/viewModels/MermaidViewModel";
import mermaid from "mermaid";
import { useEffect, useMemo, useRef, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import CodeMirror from "@uiw/react-codemirror";
import "codemirror/lib/codemirror.css"; // 核心樣式
import "codemirror/theme/material.css"; // 可選主題（這裡使用 material）
import { cn } from "@/lib/utils";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import mermaidMode from "@/app/components/doc/Mermaid/mermaidMode";
import { langs } from "@uiw/codemirror-extensions-langs";

const MermaidEditor: React.FC = () => {
    const [viewMode, setViewMode] = useState<"code" | "split" | "preview">(
        "split"
    );
    const [mermaidCode, setMermaidCode] = useState(`graph TD
      A[開始] --> B{是否？}
      B -->|是| C[確定]
      B -->|否| D[結束]
    `);
    const [renderedSvg, setRenderedSvg] = useState("");
    const [error, setError] = useState("");
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const previewRef = useRef<HTMLDivElement>(null);

    // 初始化 ViewModel
    const vm = useMemo(
        () =>
            new MermaidViewModel(
                mermaidCode,
                setMermaidCode,
                setRenderedSvg,
                setError
            ),
        [mermaidCode]
    );

    // 初始化 Mermaid
    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            theme: "default",
        });
        vm.renderMermaid(mermaidCode); // 初次渲染
    }, [mermaidCode, vm]);

    // 當程式碼改變時，使用 debounce 更新渲染
    useEffect(() => {
        const timer = setTimeout(() => {
            vm.renderMermaid(mermaidCode);
        }, 300);
        return () => clearTimeout(timer);
    }, [mermaidCode, vm]);

    return (
        <div className="relative max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
            {/* 頂部控制列 */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-gray-800">
                        Mermaid
                    </span>
                    <Select
                        value={viewMode}
                        onValueChange={(value: "code" | "split" | "preview") =>
                            setViewMode(value)
                        }
                    >
                        <SelectTrigger className="w-[180px] border-gray-300">
                            <SelectValue placeholder="選擇模式" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="code">程式碼</SelectItem>
                            <SelectItem value="split">分割</SelectItem>
                            <SelectItem value="preview">預覽</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="border-gray-300 hover:bg-gray-100"
                        onClick={() => vm.copyCode()}
                    >
                        複製
                    </Button>
                    <Button
                        variant="outline"
                        className="border-gray-300 hover:bg-gray-100"
                        onClick={() => setIsPanelOpen(true)}
                    >
                        在面板中查看
                    </Button>
                </div>
            </div>

            {/* 編輯與預覽區 */}
            <div
                className={cn(
                    viewMode === "split"
                        ? "flex flex-col md:flex-row gap-4"
                        : "",
                    viewMode === "code" || viewMode === "preview" ? "block" : ""
                )}
            >
                {viewMode !== "preview" && (
                    <div
                        className={cn(
                            viewMode === "split" ? "w-full md:w-1/2" : "w-full",
                            "border border-gray-200 rounded-md p-3 bg-gray-50"
                        )}
                    >
                        <CodeMirror
                            value={mermaidCode}
                            height="200px"
                            extensions={[langs.mermaid()]}
                            theme="light"
                            onChange={(value: string) => vm.updateCode(value)}
                        />
                    </div>
                )}
                {viewMode !== "code" && (
                    <div
                        className={cn(
                            viewMode === "split" ? "w-full md:w-1/2" : "w-full",
                            "border border-gray-200 rounded-md p-3 bg-white flex justify-center items-center"
                        )}
                        ref={previewRef}
                    >
                        {error ? (
                            <p className="text-red-500 text-center">{error}</p>
                        ) : (
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: renderedSvg,
                                }}
                            />
                        )}
                    </div>
                )}
            </div>

            {/* 右側面板 */}
            <Sheet open={isPanelOpen} onOpenChange={setIsPanelOpen}>
                <SheetContent side="right" className="p-6 w-[500px] bg-white">
                    <SheetHeader>
                        <SheetTitle className="text-lg font-semibold">
                            Mermaid 預覽
                        </SheetTitle>
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
