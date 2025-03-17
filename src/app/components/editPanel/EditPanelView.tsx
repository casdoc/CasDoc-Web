"use client";

import { useCallback, useEffect, useState } from "react";
import { useNodeSelection } from "@/app/viewModels/context/NodeSelectionContext";
import {
    ConnectionEdge,
    GraphViewModel,
} from "@/app/viewModels/GraphViewModel";
import { DocumentViewModel } from "@/app/viewModels/useDocument";
import { TextArea } from "@radix-ui/themes";
import EditPanelHeader from "./EditPanelHeader";
import EditPanelRelationship from "./EditPanelRelationship";
import EditPanelFields from "./EditPanelFields";
import { JsonObject } from "@/app/models/types/JsonObject";

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

    const [node, setNode] = useState<JsonObject>();
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

    useEffect(() => {
        if (!node) {
            selectNode(null);
        }
    }, [node, selectNode]);

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

        const updatedNode: JsonObject = { ...node, fields: newFields };
        setNode(updatedNode);
        updateEditNodeById(updatedNode.id, { fields: newFields });
    };

    const handleConfigChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>,
        key: string
    ) => {
        if (!node) return;

        const updatedConfig = {
            ...node.config,
            [key]: e.target.value,
        };

        const updatedNode: JsonObject = { ...node, config: updatedConfig };
        setNode(updatedNode);
        updateEditNodeById(updatedNode.id, { config: updatedConfig });
    };

    const handleAddField = () => {
        if (!node) return;
        const newFields = [...(node.fields ?? [])];
        newFields.push({ name: "", description: "", type: "" });

        const updatedNode: JsonObject = { ...node, fields: newFields };
        setNode(updatedNode);
        updateEditNodeById(updatedNode.id, { fields: newFields });
    };

    const handleRemoveField = (index: number) => {
        if (!node) return;
        const newFields = [...(node.fields ?? [])];
        newFields.splice(index, 1);

        const updatedNode: JsonObject = { ...node, fields: newFields };
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
                        {node?.config && Object.keys(node.config).length > 0 ? (
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                {Object.entries(node.config).map(
                                    ([key, value]) => (
                                        <div
                                            key={key}
                                            className="flex flex-col space-y-1"
                                        >
                                            <label
                                                className="text-sm text-gray-600 font-medium truncate"
                                                title={key}
                                            >
                                                {key}
                                            </label>
                                            <TextArea
                                                size="2"
                                                resize="none"
                                                radius="medium"
                                                className="resize-none bg-white p-2 text-sm w-full border border-gray-300 rounded-md focus:ring focus:ring-indigo-200"
                                                value={
                                                    value !== undefined
                                                        ? String(value)
                                                        : ""
                                                }
                                                onChange={(e) =>
                                                    handleConfigChange(e, key)
                                                }
                                            />
                                        </div>
                                    )
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">
                                No config fields
                            </p>
                        )}
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
