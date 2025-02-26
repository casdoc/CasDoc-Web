"use client";

import Editor from "../app/components/doc/Editor";
import Preview from "../app/components/doc/Preview";
import DocModeBar from "../app/components/doc/DocModeBar";
import Toolbar from "../app/components/doc/ToolBar";
import GraphView from "../app/components/doc/GraphView";
import SplitView from "../app/components/doc/SplitView";

import {
    useDocContentViewModel,
    useDocModeViewModel,
} from "@/app/viewModels/DocViewModel";
import { DocMode } from "../app/models/enum/DocMode";
import "../app/globals.css";

export default function Home() {
    const { content, setContent } = useDocContentViewModel();
    const { mode, setDocMode } = useDocModeViewModel();

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-200 text-black">
            <div
                className={`w-full my-20 ${
                    mode === DocMode.Split ? "min-w-fit" : "max-w-4xl"
                }`}
            >
                <div
                    className={`mb-6 flex justify-start ${
                        mode === DocMode.Split ? "ml-10" : ""
                    }`}
                >
                    <DocModeBar currentMode={mode} setDocMode={setDocMode} />
                </div>

                {mode === DocMode.Edit && (
                    <>
                        <Toolbar
                            onApplyFormat={(f) =>
                                setContent((prev) => prev + f)
                            }
                        />
                        <Editor value={content} onChange={setContent} />
                    </>
                )}

                {mode === DocMode.Preview && <Preview content={content} />}
                {mode === DocMode.Graph && <GraphView />}
                {mode === DocMode.Split && (
                    <SplitView content={content} setContent={setContent} />
                )}
            </div>
        </div>
    );
}
