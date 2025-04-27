import { IoEyeOutline } from "react-icons/io5";
import { FaRegEyeSlash } from "react-icons/fa";
import { useNodeSelection } from "@/app/viewModels/context/NodeSelectionContext";
import { ConnectionEdge } from "@/app/viewModels/GraphViewModel";
import { JsonObject } from "@/app/models/types/JsonObject";
import { FiLogIn } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";
import { useGraphContext } from "@/app/viewModels/context/GraphContext";
import { useState } from "react";
import { TextArea } from "@radix-ui/themes";
import { AddConnectionButton } from "./AddConnectionButton";

interface RelationSectionProps {
    type: string;
    edges: ConnectionEdge[];
    show: boolean;
    findNodeById: (id: string) => JsonObject | undefined;
    nodeIdGetter: (edge: ConnectionEdge) => string;
    toggleShow: () => void;
}

const RelationSection = ({
    type,
    edges,
    show,
    findNodeById,
    nodeIdGetter,
    toggleShow,
}: RelationSectionProps) => {
    const { selectNode } = useNodeSelection();
    const { removeConnectionEdge, updateLabel } = useGraphContext();
    const [openConnection, setOpenConnection] = useState(false);

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
                {type === "target"
                    ? "Target To:"
                    : type === "source"
                    ? "Source From:"
                    : "Unknown:"}
            </div>
            {edges.length > 0 ? (
                edges.map((edge) => {
                    const node = findNodeById(nodeIdGetter(edge));
                    if (!node || node.config.info.name.trim() === "")
                        return null;
                    return (
                        <div
                            key={`${edge.source}-${edge.target}`}
                            className="flex justify-between border-t border-gray-300 py-2 mb-2 px-4 text-sm"
                        >
                            <div className="flex flex-col w-full pb-2">
                                <div className="flex items-center justify-between py-1">
                                    <span className="text-md text-gray-800 font-semibold">
                                        {node.config.info.name}
                                    </span>
                                    <div>
                                        <button
                                            onClick={() =>
                                                selectNode(nodeIdGetter(edge))
                                            }
                                            className="mx-2"
                                        >
                                            <FiLogIn size={18} />
                                        </button>
                                        <button
                                            onClick={() =>
                                                removeConnectionEdge(edge)
                                            }
                                            className="mx-2"
                                        >
                                            <FaRegTrashAlt size={18} />
                                        </button>
                                    </div>
                                </div>
                                <TextArea
                                    value={edge.label}
                                    placeholder="Describe why you connect them"
                                    onChange={(e) =>
                                        updateLabel(edge, e.target.value)
                                    }
                                    className="text-sm text-gray-500 font-normal mt-2 bg-transparent resize-none focus:outline-none"
                                />
                            </div>
                        </div>
                    );
                })
            ) : (
                <p className="text-gray-400">
                    {type === "target"
                        ? ""
                        : type === "source"
                        ? "no sources..."
                        : "unknown..."}
                </p>
            )}
            {type === "target" && (
                <AddConnectionButton
                    open={openConnection}
                    setOpen={setOpenConnection}
                    edges={edges}
                />
            )}
        </div>
    );
};

export default RelationSection;
