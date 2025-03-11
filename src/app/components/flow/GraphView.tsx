"use client";

import { useCallback, useEffect, useState } from "react";
import {
    ReactFlow,
    useNodesState,
    useEdgesState,
    addEdge,
    Node,
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

import { getLayoutedElements } from "./utils/getLayoutedElements";
import {
    connectConnectionEdges,
    convertDataToNodes,
    convertDataToStructuralEdges,
} from "./utils/converter";
import { FlowSettingPanel } from "./setting-panel/FlowSettingPanel";

import CustomNode from "./CustomNode";
import { useGraphViewModel } from "@/app/viewModels/GraphViewModel";

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

interface GraphViewProps {
    graphNodes: Array<{ id: string; pid: string; label: string }>;
}

const GraphView = ({ graphNodes }: GraphViewProps) => {
    const [colorMode, setColorMode] = useState<"light" | "dark">("light");
    const [selectedLayout, setSelectedLayout] = useState("LR");
    const nodeWidth = 242;
    const nodeHeight = 12;

    const { fetchConnectionEdges, updConnectionEdges, removeConnectionEdge } =
        useGraphViewModel();
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);

    useEffect(() => {
        if (!graphNodes || graphNodes.length === 0) return;

        const connectionEdges = fetchConnectionEdges();
        const newNodes = convertDataToNodes(graphNodes);
        const newStructuralEdges = convertDataToStructuralEdges(graphNodes);

        const { nodes: layoutedNodes } = getLayoutedElements(
            newNodes,
            newStructuralEdges,
            "LR",
            nodeWidth,
            nodeHeight
        );

        const tmpConnectionEdges = connectConnectionEdges(connectionEdges);
        setNodes(layoutedNodes);
        setEdges([...newStructuralEdges, ...tmpConnectionEdges]);
    }, [graphNodes, selectedLayout, fetchConnectionEdges, setNodes, setEdges]);

    const onConnect = useCallback(
        (params: any) => {
            const connectionEdge = {
                source: params.source,
                target: params.target,
            };
            updConnectionEdges(connectionEdge);
            setEdges((eds) => addEdge(params, eds));
        },
        [setEdges, updConnectionEdges]
    );
    const onLayout = useCallback(
        (direction: string) => {
            setSelectedLayout(direction);
        },
        [setSelectedLayout]
    );

    const onEdgesDelete = useCallback(
        (params: any) => {
            if (params && params.length > 0) {
                removeConnectionEdge({
                    source: params[0].source,
                    target: params[0].target,
                });
            }
        },
        [removeConnectionEdge]
    );

    return (
        <div className="w-full h-full bg-white rounded-lg">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onEdgesDelete={onEdgesDelete}
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

export default GraphView;
