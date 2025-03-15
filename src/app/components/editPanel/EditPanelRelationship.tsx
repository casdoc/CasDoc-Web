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
    return (
        <div className="mt-5 pt-3 border-t border-gray-500">
            <p className="font-bold my-2">Target To:</p>
            {connectionEdges.length > 0 ? (
                connectionEdges.map((edge) => {
                    const target = findNodeById(edge.target);
                    return (
                        <p
                            key={edge.target}
                            className="bg-gray-100 p-2 mb-2 rounded text-xs w-full"
                        >
                            {target?.name}
                        </p>
                    );
                })
            ) : (
                <p className="text-gray-400">no target...</p>
            )}
        </div>
    );
};

export default EditPanelRelationship;
