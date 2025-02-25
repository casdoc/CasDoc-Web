import { useState } from "react";

export const useDocModeViewModel = () => {
  const [isPreview, setIsPreview] = useState<boolean>(false);
  return { isPreview, setIsPreview };
}

export const useDocContentViewModel = () => {
  const [content, setContent] = useState<string>("# Hello, CasDoc!\n\nThis is a **Markdown Editor** ✨");
  return { content, setContent };
}