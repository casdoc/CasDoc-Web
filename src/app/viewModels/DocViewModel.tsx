import { useState, useCallback, useEffect } from "react";
import { DocMode } from "../models/enum/DocMode";
import { DocContentModel } from "../models/DocContentModel";

export function useDocModeViewModel() {
    const [mode, setMode] = useState<DocMode>(DocMode.Preview);

    const setDocMode = useCallback((newMode: DocMode) => {
      setMode(newMode);
    }, []);

    return { mode, setDocMode };
}

export function useDocContentViewModel() {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
      setContent(DocContentModel.getContent());
  }, []);

  const updateContent = useCallback((newContent: string | ((prev: string) => string)) => {
      setContent((prev) => {
          const updatedContent = typeof newContent === "function" ? newContent(prev) : newContent;
          DocContentModel.setContent(updatedContent);
          return updatedContent;
      });
  }, []);

  return { content, setContent: updateContent };
}