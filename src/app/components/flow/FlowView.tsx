"use client";

import { useCallback, useEffect, useState } from "react";
import {
    ReactFlow,
    useNodesState,
    useEdgesState,
    addEdge,
    Background,
    MarkerType,
    BackgroundVariant,
    Controls,
    MiniMap,
    ConnectionMode,
    ConnectionLineType,
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
import { FlowSettingPanel } from "./setting-panel/FlowSettingPanel";

import CustomNode from "./CustomNode";
const nodeTypes = {
    custom: CustomNode,
};

const defaultEdgeOptions = {
    type: "smoothstep",
    markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "#b1b1b7",
        width: 30,
        height: 30,
    },
    animated: false,
    curvature: 0.1,
};

const FlowView = () => {
    const [colorMode, setColorMode] = useState<"light" | "dark">("light");
    const [selectedLayout, setSelectedLayout] = useState("LR");
    const nodeWidth = 242;
    const nodeHeight = 12;

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
            const height = direction === "LR" ? nodeHeight : nodeWidth;
            const width = direction === "TB" ? nodeWidth : nodeHeight;
            setSelectedLayout(direction);

            const newNodes = convertDataToNodes(dataItems);
            const newStructuralEdges = convertDataToStructuralEdges(dataItems);
            const { nodes: layoutedNodes } = getLayoutedElements(
                newNodes,
                newStructuralEdges,
                direction,
                width,
                height
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
                nodeTypes={nodeTypes}
                fitView
                connectionMode={ConnectionMode.Loose}
                defaultEdgeOptions={defaultEdgeOptions}
                connectionLineType={ConnectionLineType.SmoothStep}
                colorMode={colorMode}
                minZoom={0.4}
            >
                <Background
                    variant={BackgroundVariant.Cross}
                    gap={12}
                    size={1}
                />
                <FlowSettingPanel
                    onLayout={onLayout}
                    selectedLayout={selectedLayout}
                    colorMode={colorMode}
                    setColorMode={setColorMode}
                />
                <ZoomSlider position="top-left" />
                <MiniMap />
                <Controls />
            </ReactFlow>
        </div>
    );
};

export default FlowView;
