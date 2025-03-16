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
    const { updateEditNodeById, editNodes } = documentViewModel;

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
        const updatedNode: EditNode = { ...node, name: e.target.value };
        setNode(updatedNode);
        updateEditNodeById(updatedNode.id, { name: updatedNode.name });
    };

    const handleFieldChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>,
        index: number,
        key: "name" | "description" | "type"
    ) => {
        if (!node) return;
        const newFields = [...(node.fields ?? [])];

        newFields[index] = {
            ...newFields[index],
            [key]: e.target.value,
        };

        const updatedNode: EditNode = { ...node, fields: newFields };
        setNode(updatedNode);
        updateEditNodeById(updatedNode.id, { fields: newFields });
    };

    const handleAddField = () => {
        if (!node) return;
        const newFields = [...(node.fields ?? [])];
        newFields.push({ name: "", description: "", type: "" });

        const updatedNode: EditNode = { ...node, fields: newFields };
        setNode(updatedNode);
        updateEditNodeById(updatedNode.id, { fields: newFields });
    };

    const handleRemoveField = (index: number) => {
        if (!node) return;
        const newFields = [...(node.fields ?? [])];
        newFields.splice(index, 1);

        const updatedNode: EditNode = { ...node, fields: newFields };
        setNode(updatedNode);
        updateEditNodeById(updatedNode.id, { fields: newFields });
    };

    return (
        <div
            className={`fixed top-0 right-0 pt-20 h-screen w-1/3 bg-gray-50 shadow-lg p-4 border-l border-gray-300 transform transition-transform duration-500 ${
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
                    <div className="bg-white border border-gray-200 rounded-lg p-4 mr-4 shadow">
                        <h2 className="text-lg font-semibold mb-4">
                            Basic Info
                        </h2>
                        <p className="text-sm text-gray-500 mb-4">
                            <span className="font-semibold">ID:</span>{" "}
                            {selectedNode}
                        </p>
                        <label className="text-sm text-gray-500 block mb-1 pl-1">
                            Node Name
                        </label>
                        <TextArea
                            size="2"
                            resize="none"
                            radius="large"
                            placeholder="Write something..."
                            className="resize-none bg-white p-2 text-sm w-full"
                            value={node?.name ?? ""}
                            onChange={handleNodeNameChange}
                        />
                    </div>
                    {node?.type && node?.type.startsWith("template") && (
                        <div className="bg-white border border-gray-200 rounded-lg p-4 mr-4 shadow">
                            <h2 className="text-lg font-semibold mb-4">
                                Fields
                            </h2>
                            {node?.fields && node.fields.length > 0 ? (
                                <EditPanelFields
                                    fields={node.fields}
                                    handleFieldChange={handleFieldChange}
                                    handleRemoveField={handleRemoveField}
                                />
                            ) : (
                                <p className="text-gray-400 text-sm">
                                    No fields available.
                                </p>
                            )}
                            <button
                                className="mt-6 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                                onClick={handleAddField}
                            >
                                + Add Field
                            </button>
                        </div>
                    )}
                    <div className="bg-white border border-gray-200 rounded-lg p-4 mr-4 shadow">
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
