import { JsonObject } from "@/app/models/types/JsonObject";
import { useNodeSelection } from "@/app/viewModels/context/NodeSelectionContext";
import { ConnectionEdge } from "@/app/viewModels/GraphViewModel";
import { IoEyeOutline } from "react-icons/io5";
import { FaRegEyeSlash } from "react-icons/fa";

interface EditPanelRelationshipProps {
    targetEdges: ConnectionEdge[];
    sourceEdges: ConnectionEdge[];
    findNodeById: (id: string) => JsonObject | undefined;
}

const EditPanelRelationship = ({
    targetEdges,
    sourceEdges,
    findNodeById,
}: EditPanelRelationshipProps) => {
    const {
        selectNode,
        showTarget,
        toggleShowTarget,
        showSource,
        toggleShowSource,
    } = useNodeSelection();

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mr-4 shadow">
            <h2 className="text-lg font-semibold mb-4">Relationships</h2>
            <div className="mt-5 pt-3 border-t border-gray-500">
                <div
                    onClick={toggleShowTarget}
                    className="flex font-bold mt-1 mb-4 items-center cursor-pointer hover:opacity-50 transition-opacity"
                >
                    <div className="mx-2">
                        {showTarget ? (
                            <IoEyeOutline size={23} />
                        ) : (
                            <FaRegEyeSlash size={23} />
                        )}
                    </div>
                    Target To:
                </div>
                {targetEdges.length > 0 ? (
                    targetEdges.map((edge) => {
                        const target = findNodeById(edge.target);
                        if (!target || target.config.info.name.trim() === "")
                            return null;
                        return (
                            <button
                                onClick={() => selectNode(edge.target)}
                                key={edge.target}
                                className="flex justify-start bg-gray-100 py-2 mb-2 px-4 rounded text-sm w-full"
                            >
                                {target?.config.info.name}
                            </button>
                        );
                    })
                ) : (
                    <p className="text-gray-400">no target...</p>
                )}
            </div>
            <div className="mt-5 pt-3 border-t border-gray-500">
                <div
                    onClick={toggleShowSource}
                    className="flex font-bold mt-1 mb-4 items-center cursor-pointer hover:opacity-50 transition-opacity"
                >
                    <div className="mx-2">
                        {showSource ? (
                            <IoEyeOutline size={23} />
                        ) : (
                            <FaRegEyeSlash size={23} />
                        )}
                    </div>
                    Source From:
                </div>
                {sourceEdges.length > 0 ? (
                    sourceEdges.map((edge) => {
                        const target = findNodeById(edge.target);
                        if (!target || target.config.info.name.trim() === "")
                            return null;
                        return (
                            <button
                                onClick={() => selectNode(edge.source)}
                                key={edge.target}
                                className="flex justify-start bg-gray-100 py-2 mb-2 px-4 rounded text-sm w-full"
                            >
                                {target?.config.info.name}
                            </button>
                        );
                    })
                ) : (
                    <p className="text-gray-400">no source...</p>
                )}
            </div>
        </div>
    );
};

export default EditPanelRelationship;
