import { Button } from "@/components/ui/button";
import TransferComponentUI from "./TransferComponentUI";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
interface ComponentResultProps {
    toolName?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    contentResult?: any;
}

export const ToolResultComponent = ({
    toolName,
    contentResult,
}: ComponentResultProps) => {
    if (!contentResult || !toolName) {
        return null;
    }

    switch (toolName) {
        case "generate_components":
            return (
                <div>
                    <div>{contentResult?.reason}</div>
                    {contentResult?.createdComponents?.map(
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (component: any, idx: number) => (
                            <div
                                className="flex justify-start py-1 px-1"
                                key={idx}
                            >
                                <div className="bg-gray-100 dark:bg-gray-700 text-black dark:text-white rounded-xl shadow-sm whitespace-pre-wrap w-full max-w-md">
                                    <Collapsible
                                        className="w-full space-y-2 my-1"
                                        defaultOpen={true}
                                    >
                                        <div className="flex items-center justify-between space-x-4 px-4">
                                            <h4 className="text-sm font-semibold">
                                                {"Generated Component"}
                                            </h4>
                                            <CollapsibleTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                >
                                                    <ChevronsUpDown className="h-4 w-4" />
                                                </Button>
                                            </CollapsibleTrigger>
                                        </div>
                                        <CollapsibleContent className="space-y-2">
                                            <TransferComponentUI
                                                key={idx}
                                                content={component}
                                            />
                                        </CollapsibleContent>
                                    </Collapsible>
                                </div>
                            </div>
                        )
                    )}
                </div>
            );
        case "update_components":
            return (
                <div>
                    <div>{contentResult?.reason}</div>
                    {contentResult?.updatedComponent?.map(
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (component: any, idx: number) => (
                            <div
                                className="flex justify-start py-1 px-1"
                                key={idx}
                            >
                                <div className="bg-gray-100 dark:bg-gray-700 text-black dark:text-white rounded-xl shadow-sm whitespace-pre-wrap w-full max-w-md">
                                    <Collapsible
                                        className="w-full space-y-2 my-1"
                                        defaultOpen={true}
                                    >
                                        <div className="flex items-center justify-between space-x-4 px-4">
                                            <h4 className="text-sm font-semibold">
                                                {"Updated Component"}
                                            </h4>
                                            <CollapsibleTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                >
                                                    <ChevronsUpDown className="h-4 w-4" />
                                                </Button>
                                            </CollapsibleTrigger>
                                        </div>
                                        <CollapsibleContent className="space-y-2">
                                            <TransferComponentUI
                                                key={idx}
                                                content={component}
                                            />
                                        </CollapsibleContent>
                                    </Collapsible>
                                </div>
                            </div>
                        )
                    )}
                </div>
            );
        default:
            return (
                <div className="p-4">
                    <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">
                        {JSON.stringify(contentResult, null, 2)}
                    </pre>
                </div>
            );
    }
};

export default ToolResultComponent;
