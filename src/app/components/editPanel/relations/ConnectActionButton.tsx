import { useGraphContext } from "@/app/viewModels/context/GraphContext";
import { useNodeSelection } from "@/app/viewModels/context/NodeSelectionContext";
import { CircleMinus, CirclePlus } from "lucide-react";

interface ConnectActionButtonProps {
    id: string;
    isSelf: boolean;
    selected: boolean;
    toggleSelected: () => void;
}

export const ConnectActionButton = ({
    id,
    selected,
    toggleSelected,
}: ConnectActionButtonProps) => {
    const { selectedNode } = useNodeSelection();
    const { updConnectionEdges, removeConnectionEdge } = useGraphContext();
    const isSelf = id === selectedNode;

    const handleClick = () => {
        if (!selectedNode) return;
        const connectionEdge = {
            source: selectedNode,
            target: id,
            data: { bidirectional: false, offset: 50 },
        };
        if (selected) {
            removeConnectionEdge(connectionEdge);
        } else {
            updConnectionEdges(connectionEdge);
        }
        toggleSelected();
    };

    return (
        <button
            disabled={isSelf}
            onClick={handleClick}
            className={`${isSelf ? "cursor-not-allowed" : "cursor-pointer"}`}
        >
            {selected || isSelf ? (
                <CircleMinus
                    className={`h-5 w-5 ${
                        isSelf ? "text-gray-300" : "text-red-500"
                    }`}
                />
            ) : (
                <CirclePlus className="h-5 w-5 text-green-500" />
            )}
        </button>
    );
};
