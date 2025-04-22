import { Panel } from "@xyflow/react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { GraphAttachDialog } from "./GraphAttachDialog";

export const GraphAttachButton = () => {
    const [openAttach, setOpenAttach] = useState<boolean>(false);

    return (
        <Panel position="top-right">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div>
                            <GraphAttachDialog
                                openAttach={openAttach}
                                setOpenAttach={setOpenAttach}
                            />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Attach more docs</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </Panel>
    );
};
