import { JsonObject } from "@/app/models/types/JsonObject";
import { useNodeSelection } from "@/app/viewModels/context/NodeSelectionContext";
import { ConnectionEdge } from "@/app/viewModels/GraphViewModel";
import RelationshipSection from "./RelationshipSection";

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
    const { showTarget, toggleShowTarget, showSource, toggleShowSource } =
        useNodeSelection();

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow">
            <h2 className="text-lg font-semibold mb-4">Relationships</h2>
            <RelationshipSection
                type="target"
                edges={targetEdges}
                show={showTarget}
                findNodeById={findNodeById}
                nodeIdGetter={(edge) => edge.target}
                toggleShow={toggleShowTarget}
            />
            <RelationshipSection
                type="source"
                edges={sourceEdges}
                show={showSource}
                findNodeById={findNodeById}
                nodeIdGetter={(edge) => edge.source}
                toggleShow={toggleShowSource}
            />
        </div>
    );
};

export default EditPanelRelationship;
