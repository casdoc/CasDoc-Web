import { useState, useCallback, useEffect } from "react";
import { DocMode } from "../models/enum/DocMode";
import { DocModeService } from "../models/services/DocModeService";

export interface DocModeViewModel {
    mode: DocMode;
    setDocMode: (newMode: DocMode) => void;
}

export function useDocModeViewModel(): DocModeViewModel {
    const [mode, setMode] = useState<DocMode>(DocMode.Edit);

    useEffect(() => {
        const localMode = DocModeService.getDocMode();
        setMode(localMode);
    }, []);

    const setDocMode = useCallback((newMode: DocMode) => {
        setMode(newMode);
        DocModeService.setDocMode(newMode);
    }, []);

    return { mode, setDocMode };
}
