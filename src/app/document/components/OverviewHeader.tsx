"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

const OverviewHeader = () => {
    return (
        <div className="flex flex-row items-center justify-between flex-none py-2 px-3 text-black bg-white border-b border-neutral-200 dark:bg-black dark:text-white dark:border-neutral-800 z-50">
            {/* Left side with logo and mode buttons */}
            <div className="flex items-center gap-x-1.5">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <SidebarTrigger />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Sidebar</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                {/* Render the SaveStatusBadge without passing status */}
                {/* <div className="ml-2">

                    <SaveStatusBadge
                        editorStatus={editorStatus} // Pass the function to get status
                    />
                </div> */}
            </div>
        </div>
    );
};

export default OverviewHeader;
