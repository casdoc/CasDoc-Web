"use client";

import { useCallback, useEffect, useState } from "react";
import { useNodeSelection } from "@/app/viewModels/context/NodeSelectionContext";
import {
    ConnectionEdge,
    GraphViewModel,
} from "@/app/viewModels/GraphViewModel";
import { DocumentViewModel, EditNode } from "@/app/viewModels/useDocument";
import { TextArea } from "@radix-ui/themes";
import EditPanelHeader from "./EditPanelHeader";
import EditPanelRelationship from "./EditPanelRelationship";
import EditPanelFields from "./EditPanelFields";

interface EditPanelProps {
    documentViewModel: DocumentViewModel;
    graphViewModel: GraphViewModel;
}

const EditPanelView = ({
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

    const handleFieldNameChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>,
        index: number
    ) => {
        if (!node) return;
        const newFields = [...(node.fields ?? [])];
        newFields[index] = { ...newFields[index], name: e.target.value };
        setNode({ ...node, fields: newFields });
    };

    const handleFieldDescriptionChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>,
        index: number
    ) => {
        if (!node) return;
        const newFields = [...(node.fields ?? [])];
        newFields[index] = { ...newFields[index], description: e.target.value };
        setNode({ ...node, fields: newFields });
    };

    const handleFieldTypeChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>,
        index: number
    ) => {
        if (!node) return;
        const newFields = [...(node.fields ?? [])];
        newFields[index] = { ...newFields[index], type: e.target.value };
        setNode({ ...node, fields: newFields });
    };

    return (
        <div
            className={`fixed top-0 right-0 mt-14 h-screen w-1/3 bg-gray-50 shadow-lg p-4 border-l border-gray-300 transform transition-transform duration-500 ${
                isMounted
                    ? selectedNode
                        ? "translate-x-0"
                        : "translate-x-full"
                    : "translate-x-full"
            }`}
        >
            <EditPanelHeader onClose={() => selectNode(null)} />

            {selectedNode ? (
                <div className="mt-4 flex flex-col h-full space-y-4 overflow-auto pb-32">
                    <div className="bg-white border border-gray-200 rounded p-4 mr-4 shadow">
                        <h2 className="text-lg font-semibold mb-4">
                            Basic Info
                        </h2>
                        <p className="text-sm text-gray-500 mb-2">
                            <span className="font-semibold">ID:</span>{" "}
                            {selectedNode}
                        </p>
                        <label className="text-sm text-gray-500 block mb-1">
                            Node Name
                        </label>
                        <TextArea
                            size="2"
                            resize="none"
                            className="resize-none bg-white p-2 rounded text-sm w-full"
                            value={node?.name ?? ""}
                            onChange={handleNodeNameChange}
                        />
                    </div>

                    <div className="bg-white border border-gray-200 rounded p-4 mr-4 shadow">
                        <h2 className="text-lg font-semibold mb-4">Fields</h2>
                        {node?.fields && node.fields.length > 0 ? (
                            <EditPanelFields
                                fields={node.fields}
                                handleFieldNameChange={handleFieldNameChange}
                                handleFieldDescriptionChange={
                                    handleFieldDescriptionChange
                                }
                                handleFieldTypeChange={handleFieldTypeChange}
                            />
                        ) : (
                            <p className="text-gray-400 text-sm">
                                No fields available.
                            </p>
                        )}
                    </div>

                    <div className="bg-white border border-gray-200 rounded p-4 mr-4 shadow">
                        <h2 className="text-lg font-semibold mb-4">
                            Relationships
                        </h2>
                        <EditPanelRelationship
                            connectionEdges={connectionEdges}
                            findNodeById={findNodeById}
                        />
                    </div>
                </div>
            ) : (
                <p className="text-gray-500 mt-4">No node selected</p>
            )}
        </div>
    );
};

export default EditPanelView;
