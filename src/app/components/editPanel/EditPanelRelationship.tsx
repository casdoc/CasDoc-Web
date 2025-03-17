import { JsonObject } from "@/app/models/types/JsonObject";
import { useNodeSelection } from "@/app/viewModels/context/NodeSelectionContext";
import { ConnectionEdge } from "@/app/viewModels/GraphViewModel";

interface EditPanelRelationshipProps {
    connectionEdges: ConnectionEdge[];
    findNodeById: (id: string) => JsonObject | undefined;
}

const EditPanelRelationship = ({
    connectionEdges,
    findNodeById,
}: EditPanelRelationshipProps) => {
    const { selectNode } = useNodeSelection();

    return (
        <div className="mt-5 pt-3 border-t border-gray-500">
            <p className="font-bold my-2">Target To:</p>
            {connectionEdges.length > 0 ? (
                connectionEdges.map((edge) => {
                    const target = findNodeById(edge.target);
                    if (!target || target.config.name.trim() === "")
                        return null;
                    return (
                        <button
                            onClick={() => selectNode(edge.target)}
                            key={edge.target}
                            className="flex justify-start bg-gray-100 py-2 mb-2 px-4 rounded text-sm w-full"
                        >
                            {target?.config.name}
                        </button>
                    );
                })
            ) : (
                <p className="text-gray-400">no target...</p>
            )}
        </div>
    );
};

export default EditPanelRelationship;
