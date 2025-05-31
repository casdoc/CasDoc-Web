import React from "react";
import { WhiteBoardEntity } from "./entity/WhiteBoardEntity";

interface WhiteBoardUIProps {
    entity: WhiteBoardEntity;
}

const WhiteBoardUI: React.FC<WhiteBoardUIProps> = ({ entity }) => {
    const { info } = entity;

    return (
        <div className="px-4 py-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:cursor-text">
                {info.name}
            </h3>
            <span className="text-sm text-gray-700 mt-1 mb-4 group-hover:cursor-text">
                {info.description}
            </span>
        </div>
    );
};

export default WhiteBoardUI;
