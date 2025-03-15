import { useNodeSelection } from "@/app/viewModels/context/NodeSelectionContext";
import { ConnectionEdge } from "@/app/viewModels/GraphViewModel";
import { EditNode } from "@/app/viewModels/useDocument";

interface EditPanelRelationshipProps {
    connectionEdges: ConnectionEdge[];
    findNodeById: (id: string) => EditNode | undefined;
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
                    if (!target || target.name.trim() === "") return null;
                    return (
                        <button
                            onClick={() => selectNode(edge.target)}
                            key={edge.target}
                            className="flex justify-start bg-gray-100 py-2 mb-2 px-4 rounded text-sm w-full"
                        >
                            {target?.name}
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
