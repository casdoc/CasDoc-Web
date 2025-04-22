"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useNodeSelection } from "@/app/viewModels/context/NodeSelectionContext";
import EditPanelHeader from "./EditPanelHeader";
import EditPanelRelationship from "./relations/EditPanelRelationship";
import EditPanelFields from "./EditPanelFields";
import { JsonObject } from "@/app/models/types/JsonObject";
import EditPanelInfo from "./EditPanelInfo";
import EditPanelCmdHint from "./EditPanelCmdHint";
import { useGraphContext } from "@/app/viewModels/context/GraphContext";
import { ConnectionEdge } from "@/app/viewModels/GraphViewModel";

const EditPanelView = () => {
    const { selectedNode, selectNode } = useNodeSelection();
    const {
        attachedDocs,
        affectedIds,
        searchTarget,
        searchSource,
        updateAffectedIds,
        removeAffectedId,
        updateNodeById,
    } = useGraphContext();

    const [node, setNode] = useState<JsonObject>();
    const [isMounted, setIsMounted] = useState(false);
    const [targetEdges, setTargetEdges] = useState<ConnectionEdge[]>([]);
    const [sourceEdges, setSourceEdges] = useState<ConnectionEdge[]>([]);
    const [activeSection, setActiveSection] = useState<string>("info");

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
            for (const doc of attachedDocs) {
                const node = doc.nodes.find((item) => String(item.id) === id);
                if (node) {
                    return node;
                }
            }
        },
        [attachedDocs]
    );

    useEffect(() => {
        if (selectedNode) {
            const item = findNodeById(String(selectedNode));
            if (!item?.type.startsWith("template")) {
                setActiveSection("info");
            }
            setNode(item);
            const _targetEdges = searchTarget(selectedNode);
            setTargetEdges(_targetEdges);
            const _sourceEdges = searchSource(selectedNode);
            setSourceEdges(_sourceEdges);
        }
    }, [findNodeById, searchTarget, searchSource, selectedNode]);

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
    }, [selectedNode, activeSection]);

    const handleFieldChange = useCallback(
        (
            e: React.ChangeEvent<HTMLTextAreaElement>,
            key: string,
            index?: number
        ) => {
            if (!node) return;
            const updatedConfig = { ...node.config };
            if (index !== undefined) {
                const newFields = [...(node.config.fields ?? [])];
                newFields[index] = {
                    ...newFields[index],
                    [key]: e.target.value,
                };
                updatedConfig.fields = newFields;
            } else {
                const updatedInfo = {
                    ...(node.config.info || {}),
                    [key]: e.target.value,
                };
                updatedConfig.info = updatedInfo;
            }
            const updatedNode: JsonObject = {
                ...node,
                config: updatedConfig,
            };
            setNode(updatedNode);
            updateNodeById(updatedNode.id, { config: updatedConfig });

            // Update affected IDs when fields change
            if (selectedNode) {
                // const targetEdges = searchTarget(selectedNode);
                const affectedTargetIds = targetEdges.map(
                    (edge) => edge.target
                );
                updateAffectedIds(affectedTargetIds);
            }
        },
        [node, updateNodeById, selectedNode, targetEdges, updateAffectedIds]
    );

    const handleAddField = () => {
        if (!node) return;
        const newFields = [...(node.config.fields ?? [])];
        const keys = Object.keys(newFields[0] || {});
        const newItem = keys.reduce((acc, key) => {
            acc[key] = "";
            return acc;
        }, {} as Record<string, string>);
        newFields.push(newItem);

        const updatedConfig = {
            ...node.config,
            fields: newFields,
        };

        const updatedNode: JsonObject = {
            ...node,
            config: updatedConfig,
        };

        setNode(updatedNode);
        updateNodeById(updatedNode.id, { config: updatedConfig });
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
        updateNodeById(updatedNode.id, { config: updatedConfig });
    };

    return (
        <div
            className={`fixed top-0 right-0 py-20 h-screen w-1/3 bg-gray-50 shadow-lg p-4 border-l border-gray-300 transform transition-transform duration-500 ${
                isMounted
                    ? selectedNode
                        ? "translate-x-0"
                        : "translate-x-full"
                    : "translate-x-full"
            }`}
        >
            <EditPanelHeader
                type={node?.type || ""}
                onClose={() => selectNode(null)}
                section={activeSection}
                onSectionChange={setActiveSection}
            />

            {/* Alert message for source connections */}
            {sourceEdges.length > 0 && affectedIds.includes(node?.id) && (
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex justify-between items-center">
                    <div className="text-sm text-yellow-700">
                        This node has source connections that might need
                        updates.
                    </div>
                    <button
                        className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        onClick={() => removeAffectedId(node?.id)}
                    >
                        Resolve
                    </button>
                </div>
            )}

            {selectedNode ? (
                <div className="mt-4 flex flex-col h-full space-y-4 overflow-auto">
                    {activeSection === "info" && (
                        <EditPanelInfo
                            selectedNode={selectedNode}
                            info={node?.config?.info}
                            handleConfigChange={handleFieldChange}
                        />
                    )}
                    {activeSection === "fields" &&
                        node?.type &&
                        node?.type.startsWith("template") &&
                        node?.config.fields && (
                            <>
                                <div className="bg-white border border-gray-200 rounded-lg p-4  shadow">
                                    <h2 className="text-lg font-semibold mb-4">
                                        Fields
                                    </h2>
                                    {node?.config.fields &&
                                    node.config.fields.length > 0 ? (
                                        <EditPanelFields
                                            fields={node.config.fields}
                                            fieldKey={node.config.fieldKey}
                                            handleFieldChange={
                                                handleFieldChange
                                            }
                                            handleRemoveField={
                                                handleRemoveField
                                            }
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
                            </>
                        )}
                    {activeSection === "relations" && (
                        <EditPanelRelationship
                            targetEdges={targetEdges}
                            sourceEdges={sourceEdges}
                            findNodeById={findNodeById}
                        />
                    )}
                    <EditPanelCmdHint />
                </div>
            ) : (
                <p className="text-gray-500 mt-4">No node selected</p>
            )}
        </div>
    );
};

export default EditPanelView;
