"use client";

import { useCallback, useEffect, useState } from "react";
import {
    ReactFlow,
    useNodesState,
    useEdgesState,
    addEdge,
    Background,
    Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { ZoomSlider } from "./zoom-slider/zoom-slider";
import { dataItems } from "./demo-data/NodeItems";
import { getLayoutedElements } from "./utils/getLayoutedElements";
import { computeProximityEdges } from "./utils/computeProximityEdges";
import {
    convertDataToNodes,
    convertDataToStructuralEdges,
} from "./utils/converter";

const FlowView = () => {
    const [selectedLayout, setSelectedLayout] = useState("LR");
    const [nodeWidth, setNodeWidth] = useState(242);
    const [nodeHeight, setNodeHeight] = useState(12);

    const initialNodes = convertDataToNodes(dataItems);
    const initialStructuralEdges = convertDataToStructuralEdges(dataItems);
    const { nodes: layoutedNodes } = getLayoutedElements(
        initialNodes,
        initialStructuralEdges,
        "LR",
        nodeWidth,
        nodeHeight
    );
    const initialProximityEdges = computeProximityEdges(layoutedNodes);
    const initialEdges = [...initialStructuralEdges, ...initialProximityEdges];

    const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    useEffect(() => {
        const newNodes = convertDataToNodes(dataItems);
        const newStructuralEdges = convertDataToStructuralEdges(dataItems);
        const { nodes: layoutedNodes } = getLayoutedElements(
            newNodes,
            newStructuralEdges,
            "LR",
            nodeWidth,
            nodeHeight
        );
        const newProximityEdges = computeProximityEdges(layoutedNodes);
        setNodes(layoutedNodes);
        setEdges([...newStructuralEdges, ...newProximityEdges]);
    }, [setNodes, setEdges]);

    const onConnect = useCallback(
        (params: any) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    const onLayout = useCallback(
        (direction: string) => {
            const tmp = nodeWidth;
            setNodeWidth(nodeHeight);
            setNodeHeight(tmp);

            setSelectedLayout(direction);

            const newNodes = convertDataToNodes(dataItems);
            const newStructuralEdges = convertDataToStructuralEdges(dataItems);
            const { nodes: layoutedNodes } = getLayoutedElements(
                newNodes,
                newStructuralEdges,
                direction,
                nodeWidth,
                nodeHeight
            );
            const newProximityEdges = computeProximityEdges(layoutedNodes);
            setNodes(layoutedNodes);
            setEdges([...newStructuralEdges, ...newProximityEdges]);
        },
        [setNodes, setEdges]
    );

    return (
        <div className="w-full h-screen bg-white rounded-lg">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
            >
                <Background variant={"dots" as any} gap={12} size={1} />
                <Panel position="top-right">
                    {["TB", "LR"].map((key, _) => (
                        <button
                            key={key}
                            onClick={() => onLayout(key)}
                            className={`bg-gray-400 mr-3 p-2 rounded-md text-white shadow-md hover:opacity-70 ${
                                key === selectedLayout && "bg-gray-500"
                            }`}
                        >
                            {key === "TB" ? "Horizontal" : "Vertical"}
                        </button>
                    ))}
                </Panel>
                <ZoomSlider position="top-left" />
            </ReactFlow>
        </div>
    );
};

export default FlowView;
