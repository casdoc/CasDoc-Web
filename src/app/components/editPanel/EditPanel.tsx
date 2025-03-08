import { useEffect, useState } from "react";
import { useNodeSelection } from "../../viewModels/NodeSelectionContext";
import { dataItems, NodeItem } from "../flow/demo-data/NodeItems";

export const EditPanel = () => {
    const { selectedNode, selectNode } = useNodeSelection();
    const [node, setNode] = useState<NodeItem>();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        if (selectedNode) {
            const item = dataItems.find((item) => item.id == selectedNode);
            setNode(item);
        }
    }, [selectedNode]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

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
                        {node?.content}
                    </pre>
                </div>
            ) : (
                <p className="text-gray-500 mt-4">No node selected</p>
            )}
        </div>
    );
};
