import React from "react";
import {
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

interface Field {
    step: string;
    done: string;
}

interface TestCaseUIProps {
    info: {
        serial?: string;
        name?: string;
        description?: string;
        expectedResult?: string;
    };
    fields: Field[];
    isTaskDone: (status: string) => boolean;
    toggleCheckbox: () => void;
}

const TestCaseUI: React.FC<TestCaseUIProps> = ({
    info,
    fields,
    isTaskDone,
    toggleCheckbox,
}) => {
    return (
        <>
            <div className="w-full h-full pt-3 pb-1 px-3 border-b rounded-sm group/chevron">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xs font-medium text-gray-500 mb-1 group-hover:cursor-text max-w-md truncate">
                            {info.serial}
                        </p>
                        <div className="flex items-center gap-1">
                            <h2 className="text-xl font-bold text-gray-900 mt-0 group-hover:cursor-text max-w-lg overflow-x-auto">
                                {info.name || "New Test Case"}
                            </h2>
                            <CollapsibleTrigger
                                className="w-6 h-6 bg-transparent group/chevron "
                                onClick={(e) => e.stopPropagation()}
                            >
                                <ChevronDown className="w-4 h-4 opacity-0 group-hover/chevron:opacity-100 transition-all duration-200 group-data-[state=open]/chevron:rotate-180" />
                            </CollapsibleTrigger>
                        </div>
                        {info.description && (
                            <p className="text-sm text-gray-600 mt-1 group-hover:cursor-text max-w-lg overflow-x-auto">
                                {info.description}
                            </p>
                        )}
                    </div>
                </div>
            </div>
            <CollapsibleContent className="px-4 py-3 space-y-2">
                <div>
                    <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide group-hover:cursor-text w-fit">
                        Expected Result
                    </h3>
                    <p className="text-sm text-gray-700 mt-1 mb-4 group-hover:cursor-text">
                        {info.expectedResult}
                    </p>
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide group-hover:cursor-text w-fit">
                        Steps
                    </h3>
                    <ul className="divide-y divide-gray-100 mt-1">
                        {fields.map((field: Field, index: number) => (
                            <li key={index} className="flex items-start py-2">
                                <input
                                    type="checkbox"
                                    checked={isTaskDone(field.done)}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={toggleCheckbox}
                                    className="mt-1 mr-2"
                                />
                                <span
                                    className={`text-sm ${
                                        isTaskDone(field.done)
                                            ? "line-through text-gray-400"
                                            : "text-gray-800"
                                    } group-hover:cursor-text max-w-lg overflow-x-auto`}
                                >
                                    {index + 1}. {field.step}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </CollapsibleContent>
        </>
    );
};

export default TestCaseUI;
