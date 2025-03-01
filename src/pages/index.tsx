"use client";

import Editor from "@/app/components/doc/Editor";
import Preview from "@/app/components/doc/Preview";
import DocModeBar from "@/app/components/doc/DocModeBar";
import Toolbar from "@/app/components/doc/ToolBar";
import GraphView from "@/app/components/doc/GraphView";
import SplitView from "@/app/components/doc/SplitView";

import {
    useDocContentViewModel,
    useDocModeViewModel,
} from "@/app/viewModels/DocViewModel";
import { DocMode } from "@/app/models/enum/DocMode";
import "@/app/globals.css";
import DocView from "@/app/components/doc/DocView";

export default function Home() {
    return (
        <div className="min-w-fit min-h-screen flex flex-col items-center bg-gray-200 text-black">
            <DocView />
        </div>
    );
}
