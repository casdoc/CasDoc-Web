'use client';

import Editor from "../app/components/Editor";
import Preview from "../app/components/Preview";
import ToggleButton from "../app/components/ToggleButton";
import Toolbar from "../app/components/ToolBar";

import { useDocContentViewModel, useDocModeViewModel } from "@/app/viewModels/DocViewModel";
import '../app/globals.css';

export default function Home() {
  const { content, setContent } = useDocContentViewModel();
  const { isPreview, setIsPreview } = useDocModeViewModel();

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-200 text-black">
      <div className="w-full max-w-5xl my-20">
        <div className='mb-6 flex justify-start'>
          <ToggleButton 
            isPreview={isPreview} 
            toggleView={() => setIsPreview(!isPreview)} 
          />
        </div>
        {!isPreview && <Toolbar onApplyFormat={(f) => setContent((prev) => prev + f)} />}
        {isPreview ? <Preview content={content} /> : <Editor value={content} onChange={setContent} />}
      </div>
    </div>
  );
}