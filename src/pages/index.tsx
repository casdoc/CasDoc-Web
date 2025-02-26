'use client';

import Editor from "../app/components/Editor";
import Preview from "../app/components/Preview";
import DocModeBar from "../app/components/DocModeBar";
import Toolbar from "../app/components/ToolBar";
import GraphView from "../app/components/GraphView"; 
import SplitView from "../app/components/SplitView"; 

import { useDocContentViewModel, useDocModeViewModel } from "@/app/viewModels/DocViewModel";
import { DocMode } from "../app/models/enum/DocMode";
import '../app/globals.css';

export default function Home() {
  const { content, setContent } = useDocContentViewModel();
  const { mode, setDocMode } = useDocModeViewModel();

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-200 text-black">
      <div className="w-full max-w-5xl my-20">
        <div className='mb-6 flex justify-start'>
          <DocModeBar currentMode={mode} setDocMode={setDocMode} />
        </div>

        {mode === DocMode.Edit && (
          <>
            <Toolbar onApplyFormat={(f) => setContent((prev) => prev + f)} />
            <Editor value={content} onChange={setContent} />
          </>
        )}

        {mode === DocMode.Preview && <Preview content={content} />}
        {mode === DocMode.Graph && <GraphView />}
        {mode === DocMode.Split && <SplitView />}
      </div>
    </div>
  );
}