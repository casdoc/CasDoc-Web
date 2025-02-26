import { useState, useCallback } from "react";
import { DocMode } from "../models/enum/DocMode";

export function useDocModeViewModel() {
    const [mode, setMode] = useState<DocMode>(DocMode.Edit);

    const setDocMode = useCallback((newMode: DocMode) => {
        setMode(newMode);
    }, []);

    return { mode, setDocMode };
}

export const useDocContentViewModel = () => {
  const [content, setContent] = useState<string>("# Hello, CasDoc!\n\nThis is a **Markdown Editor** ✨");
  return { content, setContent };
}