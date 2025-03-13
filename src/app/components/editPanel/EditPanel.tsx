import { useCallback, useEffect, useState } from "react";
import { useNodeSelection } from "../../viewModels/context/NodeSelectionContext";
import {
    ConnectionEdge,
    GraphViewModel,
} from "@/app/viewModels/GraphViewModel";
import { NodeInfo } from "@/hooks/useDocument";

interface EditPanelProps {
    nodesData: NodeInfo[];
    graphViewModel: GraphViewModel;
}

export const EditPanel = ({ nodesData, graphViewModel }: EditPanelProps) => {
    const { selectedNode, selectNode } = useNodeSelection();
    const { searchBySourceId } = graphViewModel;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [node, setNode] = useState<any>();
    const [isMounted, setIsMounted] = useState(false);
    const [connectionEdges, setConnectionEdges] = useState<ConnectionEdge[]>(
        []
    );

    const findNodeById = useCallback(
        (id: string) => {
            const node = nodesData.find((item) => `${item.id}` === id);
            return node;
        },
        [nodesData]
    );
    useEffect(() => {
        if (selectedNode) {
            const item = findNodeById(`${selectedNode}`);
            setConnectionEdges(searchBySourceId(selectedNode));
            setNode(item);
        }
    }, [findNodeById, searchBySourceId, selectedNode]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <div
            className={`fixed top-0 right-0 mt-14 h-full w-80 bg-white shadow-lg p-4 transform transition-transform duration-500 ${
                isMounted
                    ? selectedNode
                        ? "translate-x-0"
                        : "translate-x-full"
                    : "translate-x-full"
            }`}
        >
            <div className="flex justify-between items-center border-b pb-2">
                <h2 className="text-lg font-semibold">Node Details</h2>
                <button
                    onClick={() => selectNode(null)}
                    className="text-gray-500 hover:text-black"
                >
                    ✖
                </button>
            </div>
            {selectedNode ? (
                <div className="mt-4">
                    <p className="text-sm text-gray-600">ID: {selectedNode}</p>
                    <pre className="bg-gray-100 p-2 mt-2 rounded text-xs">
                        {node?.label}
                    </pre>
                    <div className="mt-5 pt-3 border-t border-gray-500">
                        <p className="font-bold my-2">Target To:</p>
                        {connectionEdges.length > 0 ? (
                            connectionEdges.map((edge) => {
                                const target = findNodeById(edge.target);
                                return <p key={edge.target}>{target?.label}</p>;
                            })
                        ) : (
                            <p className="text-gray-400">no target...</p>
                        )}
                    </div>
                </div>
            ) : (
                <p className="text-gray-500 mt-4">No node selected</p>
            )}
        </div>
    );
};
