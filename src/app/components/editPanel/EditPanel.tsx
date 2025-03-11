import { useEffect, useState } from "react";
import { useNodeSelection } from "../../viewModels/NodeSelectionContext";
import tmp from "@/app/components/doc/tmp.json";
import {
    ConnectionEdge,
    useGraphViewModel,
} from "@/app/viewModels/GraphViewModel";

export const EditPanel = () => {
    const { selectedNode, selectNode } = useNodeSelection();
    const { searchBySourceId } = useGraphViewModel();
    const [node, setNode] = useState<any>();
    const [isMounted, setIsMounted] = useState(false);
    const [connectionEdges, setConnectionEdges] = useState<ConnectionEdge[]>(
        []
    );

    useEffect(() => {
        if (selectedNode) {
            const item = findNodeById(`${selectedNode}`);
            setConnectionEdges(searchBySourceId(selectedNode));
            setNode(item);
        }
    }, [selectedNode]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const findNodeById = (id: string) => {
        const node = tmp.content.find((item) => `${item.id}` === id);
        return node;
    };

    return (
        <div
            className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg p-4 transform transition-transform duration-500 ${
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
                        {node?.attrs.content}
                    </pre>
                    <div className="mt-5 pt-3 border-t border-gray-500">
                        <p className="font-bold my-2">Target To:</p>
                        {connectionEdges.length > 0 ? (
                            connectionEdges.map((edge) => {
                                const target = findNodeById(edge.target);
                                return <p>{target?.attrs.content}</p>;
                            })
                        ) : (
                            <p>no target...</p>
                        )}
                    </div>
                </div>
            ) : (
                <p className="text-gray-500 mt-4">No node selected</p>
            )}
        </div>
    );
};
