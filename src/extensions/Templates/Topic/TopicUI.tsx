import React from "react";
import { TopicEntity } from "./entity/TopicEntity";

interface TopicUIProps {
    entity: TopicEntity;
}

const TopicUI: React.FC<TopicUIProps> = ({ entity }) => {
    const { info } = entity;

    return (
        <div className={`border-l-4 ${entity.getBorderColor()} pl-3`}>
            <h2
                className={`font-bold text-black m-0 px-0 pb-1 group-hover:cursor-text w-fit ${entity.getLevelStyle()}`}
            >
                {info.name || "Unknown"}
            </h2>
            <p className="m-0 p-0 text-sm text-gray-500 font-semibold group-hover:cursor-text w-fit">
                {info.description}
            </p>
        </div>
    );
};

export default TopicUI;
