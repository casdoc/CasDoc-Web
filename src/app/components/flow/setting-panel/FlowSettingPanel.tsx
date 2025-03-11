import { Panel } from "@xyflow/react";
import { FlowColorModeButton } from "./FlowColorModeButton";
import { FlowLayoutSetupButton } from "./FlowLayoutSetupButton";

interface FlowSettingPanel {
    onLayout: (direction: string) => void;
    selectedLayout: string;
    colorMode: "light" | "dark";
    setColorMode: (mode: "light" | "dark") => void;
}

export const FlowSettingPanel = ({
    onLayout,
    selectedLayout,
    colorMode,
    setColorMode,
}: FlowSettingPanel) => {
    return (
        <Panel position="top-right">
            <FlowLayoutSetupButton
                onLayout={onLayout}
                selectedLayout={selectedLayout}
            />
            <FlowColorModeButton mode={colorMode} setMode={setColorMode} />
        </Panel>
    );
};
