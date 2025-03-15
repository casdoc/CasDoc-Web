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
    MiniMap,
    ConnectionMode,
    ConnectionLineType,
    useReactFlow,
    Edge,
    Connection,
    useStoreApi,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { ZoomSlider } from "./zoom-slider/zoom-slider";
import { getLayoutedElements } from "./utils/getLayoutedElements";
import {
    connectConnectionEdges,
    convertDataToNodes,
    convertDataToStructuralEdges,
} from "./utils/converter";
// import { FlowSettingPanel } from "./setting-panel/FlowSettingPanel";
import CustomNode from "./CustomNode";
import { GraphViewModel } from "@/app/viewModels/GraphViewModel";
import { GraphNode } from "@/app/viewModels/useDocument";
import DocMode from "@/app/models/enum/DocMode";
import { FlowScrollModeButton } from "./setting-panel/FlowScrollModeButton";
import ToastManager from "@/app/viewModels/ToastManager";
import { useNodeSelection } from "@/app/viewModels/context/NodeSelectionContext";

const nodeTypes = { custom: CustomNode };

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
    docMode: DocMode | undefined;
    graphNodes: GraphNode[];
    graphViewModel: GraphViewModel;
}

const GraphView = ({ docMode, graphNodes, graphViewModel }: GraphViewProps) => {
    // const [colorMode, setColorMode] = useState<"light" | "dark">("light");
    // const [selectedLayout, setSelectedLayout] = useState("LR");
    const [scrollMode, setScrollMode] = useState<"zoom" | "drag">("drag");
    const nodeWidth = 242;
    const nodeHeight = 12;

    const { fetchConnectionEdges, updConnectionEdges, removeConnectionEdge } =
        graphViewModel;
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const { fitView, setCenter } = useReactFlow();
    const { showToast, ToastComponent } = ToastManager();
    const { selectedNode, selectNode } = useNodeSelection();
    const store = useStoreApi();

    useEffect(() => {
        if (!graphNodes || graphNodes.length === 0) {
            setNodes([]);
            return;
        }

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
    }, [graphNodes, fetchConnectionEdges, setNodes, setEdges]);

    useEffect(() => {
        fitView({ duration: 300 });
    }, [docMode, fitView]);

    const onConnect = useCallback(
        (params: Connection) => {
            const connectionEdge = {
                source: params.source,
                target: params.target,
            };
            updConnectionEdges(connectionEdge);
            setEdges((eds) => addEdge(params, eds));
        },
        [setEdges, updConnectionEdges]
    );

    // const onLayout = useCallback(
    //     (direction: string) => {
    //         setSelectedLayout(direction);
    //     },
    //     [setSelectedLayout]
    // );

    const onEdgesDelete = useCallback(
        (params: Edge[]) => {
            if (params && params.length > 0) {
                removeConnectionEdge({
                    source: params[0].source,
                    target: params[0].target,
                });
            }
        },
        [removeConnectionEdge]
    );

    const handleToggleScrollMode = () => {
        setScrollMode((prev) => (prev === "zoom" ? "drag" : "zoom"));
        showToast(scrollMode === "zoom" ? "Scroll to pan" : "Scroll to zoom");
    };

    useEffect(() => {
        if (!selectedNode) {
            fitView({ duration: 500 });
            return;
        }
        const { nodeLookup } = store.getState();
        const nodes = Array.from(nodeLookup).map(([, node]) => node);

        if (nodes.length > 0) {
            const node = nodes.find((n) => n.id === selectedNode);
            if (!node) return;

            const x = node.position.x + 280;
            const y = node.position.y / 2;
            const zoom = 1.1;

            setCenter(x, y, { zoom, duration: 500 });
        }
    }, [selectedNode, setCenter, store, fitView]);

    return (
        <div className="w-full h-full bg-white relative">
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
                // colorMode={colorMode}
                minZoom={0.4}
                maxZoom={1.8}
                zoomOnScroll={scrollMode === "zoom"}
                panOnScroll={scrollMode === "drag"}
                onPaneClick={() => selectNode(null)}
                panOnScrollSpeed={1.1}
                // onSelectionStart={() => alert("start")}
            >
                <Background
                    variant={BackgroundVariant.Cross}
                    gap={12}
                    size={1}
                    color="gray"
                />
                {/* <FlowSettingPanel
                    onLayout={onLayout}
                    selectedLayout={selectedLayout}
                    colorMode={colorMode}
                    setColorMode={setColorMode}
                /> */}
                <ZoomSlider position="top-left" />
                <MiniMap />
                {ToastComponent}
            </ReactFlow>
            <FlowScrollModeButton
                scrollMode={scrollMode}
                handleToggleScrollMode={handleToggleScrollMode}
            />
        </div>
    );
};

export default GraphView;
