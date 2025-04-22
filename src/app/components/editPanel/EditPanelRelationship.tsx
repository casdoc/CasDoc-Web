import { JsonObject } from "@/app/models/types/JsonObject";
import { useNodeSelection } from "@/app/viewModels/context/NodeSelectionContext";
import { ConnectionEdge } from "@/app/viewModels/GraphViewModel";
import RelationshipSection from "./RelationshipSection";

interface EditPanelRelationshipProps {
    targetEdges: ConnectionEdge[];
    sourceEdges: ConnectionEdge[];
    findNodeById: (id: string) => JsonObject | undefined;
    removeEdge: (edge: ConnectionEdge) => void;
    updLabel: (edge: ConnectionEdge, content: string) => void;
}

const EditPanelRelationship = ({
    targetEdges,
    sourceEdges,
    findNodeById,
    removeEdge,
    updLabel,
}: EditPanelRelationshipProps) => {
    const { showTarget, toggleShowTarget, showSource, toggleShowSource } =
        useNodeSelection();

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow">
            <h2 className="text-lg font-semibold mb-4">Relationships</h2>
            <RelationshipSection
                title="Target To:"
                edges={targetEdges}
                findNodeById={findNodeById}
                nodeIdGetter={(edge) => edge.target}
                emptyText="no target..."
                show={showTarget}
                toggleShow={toggleShowTarget}
                removeEdge={removeEdge}
                updLabel={updLabel}
            />
            <RelationshipSection
                title="Source From:"
                edges={sourceEdges}
                findNodeById={findNodeById}
                nodeIdGetter={(edge) => edge.source}
                emptyText="no source..."
                show={showSource}
                toggleShow={toggleShowSource}
                removeEdge={removeEdge}
                updLabel={updLabel}
            />
        </div>
    );
};

export default EditPanelRelationship;
