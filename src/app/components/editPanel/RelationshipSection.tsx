import { IoEyeOutline } from "react-icons/io5";
import { FaRegEyeSlash } from "react-icons/fa";
import { useNodeSelection } from "@/app/viewModels/context/NodeSelectionContext";
import { ConnectionEdge } from "@/app/viewModels/GraphViewModel";
import { JsonObject } from "@/app/models/types/JsonObject";
import { FiLogIn } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";

interface RelationshipSectionProps {
    title: string;
    edges: ConnectionEdge[];
    findNodeById: (id: string) => JsonObject | undefined;
    nodeIdGetter: (edge: ConnectionEdge) => string;
    emptyText: string;
    show: boolean;
    toggleShow: () => void;
    removeEdge: (edge: ConnectionEdge) => void;
}

const RelationshipSection = ({
    title,
    edges,
    findNodeById,
    nodeIdGetter,
    emptyText,
    show,
    toggleShow,
    removeEdge,
}: RelationshipSectionProps) => {
    const { selectNode } = useNodeSelection();

    const handleRemove = (edge: ConnectionEdge) => {
        removeEdge({
            source: edge.source,
            target: edge.target,
        });
    };

    return (
        <div className="mt-5 pt-3 border-t border-gray-500">
            <div
                onClick={toggleShow}
                className="flex font-bold mt-1 mb-4 items-center cursor-pointer hover:opacity-50 transition-opacity"
            >
                <div className="mx-2">
                    {show ? (
                        <IoEyeOutline size={23} />
                    ) : (
                        <FaRegEyeSlash size={23} />
                    )}
                </div>
                {title}
            </div>
            {edges.length > 0 ? (
                edges.map((edge) => {
                    const node = findNodeById(edge.target);
                    if (!node || node.config.info.name.trim() === "")
                        return null;
                    return (
                        <div
                            key={`${edge.source}-${edge.target}`}
                            className="flex justify-between bg-gray-100 py-2 mb-2 px-4 rounded text-sm w-full"
                        >
                            {node.config.info.name}
                            <div className="flex">
                                <button
                                    onClick={() =>
                                        selectNode(nodeIdGetter(edge))
                                    }
                                    className="mx-2"
                                >
                                    <FiLogIn size={18} />
                                </button>
                                <button
                                    onClick={() => handleRemove(edge)}
                                    className="mx-2"
                                >
                                    <FaRegTrashAlt size={18} />
                                </button>
                            </div>
                        </div>
                    );
                })
            ) : (
                <p className="text-gray-400">{emptyText}</p>
            )}
        </div>
    );
};

export default RelationshipSection;
