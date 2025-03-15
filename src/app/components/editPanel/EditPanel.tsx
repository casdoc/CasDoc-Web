"use client";

import { useCallback, useEffect, useState } from "react";
import { useNodeSelection } from "@/app/viewModels/context/NodeSelectionContext";
import {
    ConnectionEdge,
    GraphViewModel,
} from "@/app/viewModels/GraphViewModel";
import { DocumentViewModel, EditNode } from "@/app/viewModels/useDocument";
import { TextArea } from "@radix-ui/themes";

interface EditPanelProps {
    documentViewModel: DocumentViewModel;
    graphViewModel: GraphViewModel;
}

export const EditPanel = ({
    documentViewModel,
    graphViewModel,
}: EditPanelProps) => {
    const { selectedNode, selectNode } = useNodeSelection();
    const { searchBySourceId } = graphViewModel;
    const { editNodes } = documentViewModel;

    const [node, setNode] = useState<EditNode>();
    const [isMounted, setIsMounted] = useState(false);
    const [connectionEdges, setConnectionEdges] = useState<ConnectionEdge[]>(
        []
    );

    const findNodeById = useCallback(
        (id: string) => {
            return editNodes.find((item) => String(item.id) === id);
        },
        [editNodes]
    );

    useEffect(() => {
        if (selectedNode) {
            const item = findNodeById(String(selectedNode));
            setNode(item);
            const edges = searchBySourceId(selectedNode);
            setConnectionEdges(edges);
        }
    }, [findNodeById, searchBySourceId, selectedNode]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleNodeNameChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        if (!node) return;
        setNode({ ...node, name: e.target.value });
    };

    return (
        <div
            className={`fixed top-0 right-0 mt-14 h-full w-96 bg-white shadow-lg p-4 transform transition-transform duration-500 border-l border-l-gray-300 ${
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

                    <TextArea
                        className="resize-none bg-gray-100 p-2 mt-2 rounded text-xs w-full"
                        value={node?.name ?? ""}
                        onChange={handleNodeNameChange}
                    />

                    <div className="mt-5 pt-3 border-t border-gray-500">
                        <p className="font-bold my-2">Fields</p>
                        {node?.fields?.map((field, index) => (
                            <div
                                key={index}
                                className="bg-gray-100 p-2 mb-2 rounded text-xs w-full"
                            >
                                <p className="font-semibold">{field.name}</p>
                                <p>{field.description}</p>
                            </div>
                        ))}
                    </div>

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
                </div>
            ) : (
                <p className="text-gray-500 mt-4">No node selected</p>
            )}
        </div>
    );
};
