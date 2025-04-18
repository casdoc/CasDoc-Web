import { Panel } from "@xyflow/react";
import { IoExtensionPuzzleOutline } from "react-icons/io5";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export const GraphAttach = () => {
    return (
        <Panel position="top-right">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button className="hover:bg-gray-200 transition-colors duration-300 p-1.5 rounded-lg">
                            <IoExtensionPuzzleOutline size={28} />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Attach more docs</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </Panel>
    );
};
