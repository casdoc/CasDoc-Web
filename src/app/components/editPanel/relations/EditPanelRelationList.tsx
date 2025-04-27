import { JsonObject } from "@/app/models/types/JsonObject";
import { useNodeSelection } from "@/app/viewModels/context/NodeSelectionContext";
import { ConnectionEdge } from "@/app/viewModels/GraphViewModel";
import RelationSection from "./RelationSection";

interface EditPanelRelationListProps {
    targetEdges: ConnectionEdge[];
    sourceEdges: ConnectionEdge[];
    findNodeById: (id: string) => JsonObject | undefined;
}

const EditPanelRelationList = ({
    targetEdges,
    sourceEdges,
    findNodeById,
}: EditPanelRelationListProps) => {
    const { showTarget, toggleShowTarget, showSource, toggleShowSource } =
        useNodeSelection();

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow">
            <h2 className="text-lg font-semibold mb-4">Relationships</h2>
            <RelationSection
                type="target"
                edges={targetEdges}
                show={showTarget}
                findNodeById={findNodeById}
                nodeIdGetter={(edge) => edge.target}
                toggleShow={toggleShowTarget}
            />
            <RelationSection
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

export default EditPanelRelationList;
