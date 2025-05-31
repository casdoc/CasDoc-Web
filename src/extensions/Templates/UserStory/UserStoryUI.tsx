import React from "react";
import {
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { UserStoryEntity, AcceptanceCriteria } from "./entity/UserStoryEntity";

interface UserStoryUIProps {
    entity: UserStoryEntity;
    toggleCheckbox: () => void;
}

const UserStoryUI: React.FC<UserStoryUIProps> = ({
    entity,
    toggleCheckbox,
}) => {
    const { info, fields } = entity;

    return (
        <>
            <div className="w-full h-full pt-3 pb-1 px-3 border-b rounded-sm group/chevron">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xs font-medium text-gray-500 mb-1 group-hover:cursor-text w-fit">
                            {info.serial}
                        </p>
                        <div className="flex items-center gap-1 group-hover:cursor-text">
                            <h2 className="text-xl font-bold text-gray-900 mt-0 group-hover:cursor-text">
                                {info.name || "New Story"}
                            </h2>
                            <CollapsibleTrigger
                                className="w-6 h-6 bg-transparent group/chevron "
                                onClick={(e) => e.stopPropagation()}
                            >
                                <ChevronDown className="w-4 h-4 opacity-0 group-hover/chevron:opacity-100 transition-all duration-200 group-data-[state=open]/chevron:rotate-180" />
                            </CollapsibleTrigger>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 my-1">
                            {info.tag?.trim() !== "" && (
                                <div className="group-hover:cursor-text">
                                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded border border-blue-300 group-hover:cursor-text">
                                        {info.tag}
                                    </span>
                                </div>
                            )}
                            {info.priority?.trim() !== "" && (
                                <div className="group-hover:cursor-text">
                                    <span
                                        className={`text-xs px-2 py-1 rounded font-medium border ${entity.calculatePriorityStyle(
                                            info.priority
                                                ? parseInt(info.priority)
                                                : 0
                                        )} group-hover:cursor-text`}
                                    >
                                        P{info.priority}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <CollapsibleContent className="px-4 py-3 space-y-2">
                <div>
                    <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Role
                    </h3>
                    <div className="group-hover:cursor-text">
                        <p className="text-sm text-gray-700 mt-1 mb-4 group-hover:cursor-text">
                            {info.role}
                        </p>
                    </div>
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Feature
                    </h3>
                    <div className="group-hover:cursor-text">
                        <p className="text-sm text-gray-700 mt-1 mb-4 group-hover:cursor-text">
                            {info.feature}
                        </p>
                    </div>
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Acceptance Criteria
                    </h3>
                    <ul className="divide-y divide-gray-100 mt-1">
                        {fields.map(
                            (field: AcceptanceCriteria, index: number) => (
                                <li
                                    key={index}
                                    className="flex items-start py-2"
                                >
                                    <input
                                        type="checkbox"
                                        checked={entity.isTaskDone(field.done)}
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={toggleCheckbox}
                                        className="mt-1 mr-2"
                                    />
                                    <div className="group-hover:cursor-text">
                                        <span
                                            className={`text-sm ${
                                                entity.isTaskDone(field.done)
                                                    ? "line-through text-gray-400"
                                                    : "text-gray-800"
                                            }`}
                                        >
                                            {field.acceptance}
                                        </span>
                                    </div>
                                </li>
                            )
                        )}
                    </ul>
                </div>
            </CollapsibleContent>
        </>
    );
};

export default UserStoryUI;
