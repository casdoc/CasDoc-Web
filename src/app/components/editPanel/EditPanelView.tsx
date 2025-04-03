"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useNodeSelection } from "@/app/viewModels/context/NodeSelectionContext";
import {
    ConnectionEdge,
    GraphViewModel,
} from "@/app/viewModels/GraphViewModel";
import { DocumentViewModel } from "@/app/viewModels/useDocument";
import EditPanelHeader from "./EditPanelHeader";
import EditPanelRelationship from "./EditPanelRelationship";
import EditPanelFields from "./EditPanelFields";
import { JsonObject } from "@/app/models/types/JsonObject";
import EditPanelInfo from "./EditPanelInfo";
import EditPanelCmdHint from "./EditPanelCmdHint";

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

    const prevSelectState = useRef(selectedNode);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (
                ((event.metaKey || event.ctrlKey) && event.key === "Enter") ||
                event.key === "Escape"
            ) {
                if (selectedNode) {
                    // Only prevent default if we're actually closing the panel
                    event.preventDefault();
                    selectNode(null);
                }
            }
            prevSelectState.current = selectedNode;
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectNode, selectedNode]);

    useEffect(() => {
        const handleTabKey = (event: KeyboardEvent) => {
            if (event.key === "Tab") {
                event.preventDefault();
                const textareas = Array.from(
                    document.querySelectorAll("textarea")
                );
                const activeElement =
                    document.activeElement as HTMLTextAreaElement;
                const currentIndex = textareas.indexOf(activeElement);

                if (currentIndex !== -1) {
                    let nextIndex;
                    if (event.shiftKey) {
                        nextIndex =
                            (currentIndex - 1 + textareas.length) %
                            textareas.length;
                    } else {
                        nextIndex = (currentIndex + 1) % textareas.length;
                    }
                    const nextTextarea = textareas[
                        nextIndex
                    ] as HTMLTextAreaElement;
                    nextTextarea.focus();
                    const length = nextTextarea.value.length;
                    nextTextarea.setSelectionRange(length, length);
                }
            }
        };

        window.addEventListener("keydown", handleTabKey);
        return () => {
            window.removeEventListener("keydown", handleTabKey);
        };
    }, []);

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
        if (selectedNode) {
            setTimeout(() => {
                const firstTextarea = document.querySelector(
                    "textarea"
                ) as HTMLTextAreaElement | null;
                if (firstTextarea) {
                    firstTextarea.focus();
                    const length = firstTextarea.value.length;
                    firstTextarea.setSelectionRange(length, length);
                }
            }, 0);
        }
    }, [selectedNode]);

    const handleFieldChange = useCallback(
        (
            e: React.ChangeEvent<HTMLTextAreaElement>,
            index: number,
            key: "name" | "description" | "type"
        ) => {
            if (!node) return;
            const newFields = [...(node.config.fields ?? [])];

            newFields[index] = {
                ...newFields[index],
                [key]: e.target.value,
            };
            const updatedConfig = {
                ...node.config,
                fields: newFields,
            };

            const updatedNode: JsonObject = {
                ...node,
                config: updatedConfig,
            };

            setNode(updatedNode);
            updateEditNodeById(updatedNode.id, { config: updatedConfig });
        },
        [node, updateEditNodeById]
    );

    const handleConfigChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>,
        key: string
    ) => {
        if (!node) return;

        const updatedInfo = {
            ...(node.config.info || {}),
            [key]: e.target.value,
        };

        const updatedConfig = {
            ...node.config,
            info: updatedInfo,
        };

        const updatedNode: JsonObject = {
            ...node,
            config: updatedConfig,
        };

        setNode(updatedNode);
        updateEditNodeById(updatedNode.id, { config: updatedConfig });
    };

    const handleAddField = () => {
        if (!node) return;
        const newFields = [...(node.config.fields ?? [])];
        newFields.push({ name: "", description: "", type: "" });

        const updatedConfig = {
            ...node.config,
            fields: newFields,
        };

        const updatedNode: JsonObject = {
            ...node,
            config: updatedConfig,
        };

        setNode(updatedNode);
        updateEditNodeById(updatedNode.id, { config: updatedConfig });
    };

    const handleRemoveField = (index: number) => {
        if (!node) return;
        const newFields = [...(node.config.fields ?? [])];
        newFields.splice(index, 1);

        const updatedConfig = {
            ...node.config,
            fields: newFields,
        };

        const updatedNode: JsonObject = {
            ...node,
            config: updatedConfig,
        };

        setNode(updatedNode);
        updateEditNodeById(updatedNode.id, { config: updatedConfig });
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
                <div className="mt-4 flex flex-col h-full space-y-4 overflow-auto">
                    <EditPanelInfo
                        selectedNode={selectedNode}
                        info={node?.config.info}
                        handleConfigChange={handleConfigChange}
                    />
                    {node?.type &&
                        node?.type.startsWith("template") &&
                        node?.config.fields && (
                            <div className="bg-white border border-gray-200 rounded-lg p-4 mr-4 shadow">
                                <h2 className="text-lg font-semibold mb-4">
                                    Fields
                                </h2>
                                {node?.config.fields &&
                                node.config.fields.length > 0 ? (
                                    <EditPanelFields
                                        fields={node.config.fields}
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
                    <EditPanelRelationship
                        connectionEdges={connectionEdges}
                        findNodeById={findNodeById}
                    />
                    <EditPanelCmdHint />
                </div>
            ) : (
                <p className="text-gray-500 mt-4">No node selected</p>
            )}
        </div>
    );
};

export default EditPanelView;
