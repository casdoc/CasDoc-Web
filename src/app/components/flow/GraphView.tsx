"use client";

import { memo, useCallback, useEffect, useState } from "react";
import {
    ReactFlow,
    useNodesState,
    useEdgesState,
    addEdge,
    Node,
    Background,
    MarkerType,
    BackgroundVariant,
    // MiniMap,
    ConnectionMode,
    ConnectionLineType,
    useReactFlow,
    Edge,
    Connection,
    useStoreApi,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { ConnectionEdge } from "@/app/models/entity/ConnectionEdge";
import { ZoomSlider } from "./zoom-slider";
import { getLayoutedElements } from "./utils/getLayoutedElements";
import {
    connectConnectionEdges,
    convertDataToNodes,
    convertDataToStructuralEdges,
} from "./utils/converter";
// import { FlowSettingPanel } from "./setting-panel/FlowSettingPanel";
import CustomNode from "./components/CustomNode";
import DocMode from "@/app/models/enum/DocMode";
import { FlowScrollModeButton } from "./setting-panel/FlowScrollModeButton";
import ToastManager from "@/app/viewModels/ToastManager";
import { useNodeSelection } from "@/app/viewModels/context/NodeSelectionContext";
import CustomEdge from "./components/CustomEdge";
import { useGraphContext } from "@/app/viewModels/context/GraphContext";
import { GraphAttachButton } from "./graph-attach/GraphAttachButton";
import { useProjectContext } from "@/app/viewModels/context/ProjectContext";
import { uuidv4 } from "zod";

const nodeTypes = { custom: CustomNode };
const edgeTypes = {
    custom: CustomEdge,
};

const defaultEdgeOptions = {
    type: "custom",
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
}

const GraphView = ({ docMode }: GraphViewProps) => {
    // const [colorMode, setColorMode] = useState<"light" | "dark">("light");
    // const [selectedLayout, setSelectedLayout] = useState("LR");
    const [scrollMode, setScrollMode] = useState<"zoom" | "drag">("drag");
    const nodeWidth = 232;
    const nodeHeight = 36;
    const { selectedProjectId } = useProjectContext();
    // const { isSuccess: isConnectionsSuccess, isLoading: isConnectionsLoading } =
    //     useConnectionsQuery(selectedProjectId || "");
    const {
        connectionEdges,
        affectedIds,
        updConnectionEdges,
        removeConnectionEdge,
        parseAttachedDocsToNodes,
    } = useGraphContext();

    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const { fitView, setCenter } = useReactFlow();
    const { showToast, ToastComponent } = ToastManager();
    const { selectedNode, selectNode } = useNodeSelection();
    const store = useStoreApi();

    useEffect(() => {
        const graphNodes = parseAttachedDocsToNodes();
        // console.debug("graphNodes", graphNodes);
        if (!graphNodes || graphNodes.length === 0) {
            setNodes([]);
            return;
        }
        const newNodes = convertDataToNodes(graphNodes, affectedIds);
        const newStructuralEdges = convertDataToStructuralEdges(graphNodes);

        const { layoutedNodes } = getLayoutedElements(
            newNodes,
            newStructuralEdges,
            "LR",
            nodeWidth,
            nodeHeight
        );

        const tmpConnectionEdges = connectConnectionEdges(connectionEdges);
        setNodes(layoutedNodes);
        setEdges([...newStructuralEdges, ...tmpConnectionEdges]);
    }, [
        connectionEdges,
        affectedIds,
        setNodes,
        setEdges,
        parseAttachedDocsToNodes,
    ]);

    useEffect(() => {
        fitView({ duration: 500 });
    }, [docMode, fitView, nodes.length]);

    const onConnect = useCallback(
        (params: Connection) => {
            if (!selectedProjectId) return;
            const connectionEdge = new ConnectionEdge(
                uuidv4().toString(),
                selectedProjectId,
                params.source,
                params.target,
                "",
                50,
                false
            );
            updConnectionEdges(connectionEdge);
            setEdges((eds) => addEdge(params, eds));
        },
        [selectedProjectId, setEdges, updConnectionEdges]
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
                const deletedEdge = params[0];

                // Find the actual ConnectionEdge from connectionEdges array
                const actualConnectionEdge = connectionEdges.find(
                    (edge) =>
                        (edge.source === deletedEdge.source &&
                            edge.target === deletedEdge.target) ||
                        (edge.source === deletedEdge.target &&
                            edge.target === deletedEdge.source &&
                            edge.bidirectional)
                );

                if (actualConnectionEdge) {
                    // If it's a bidirectional edge but we're deleting the reversed direction
                    if (
                        actualConnectionEdge.source === deletedEdge.target &&
                        actualConnectionEdge.target === deletedEdge.source &&
                        actualConnectionEdge.bidirectional
                    ) {
                        // Create a temporary edge object representing the reversed direction
                        const reversedEdge = new ConnectionEdge(
                            actualConnectionEdge.id,
                            actualConnectionEdge.projectId,
                            deletedEdge.source,
                            deletedEdge.target,
                            actualConnectionEdge.label,
                            actualConnectionEdge.offsetValue,
                            true
                        );
                        removeConnectionEdge(reversedEdge);
                    } else {
                        removeConnectionEdge(actualConnectionEdge);
                    }
                }
            }
        },
        [connectionEdges, removeConnectionEdge]
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

            let x = node.position.x + 280;
            let y = node.position.y;
            if (node.measured.width) {
                x += node.measured.width / 2;
            }
            if (node.measured.height) {
                y += node.measured.height / 2;
            }
            const zoom = 1.1;

            setCenter(x, y, { zoom, duration: 500 });
        }
    }, [selectedNode, setCenter, store, fitView]);

    if (docMode === DocMode.Edit) return;

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
                edgeTypes={edgeTypes}
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
                {/* <GraphAttachButton /> */}
                <ZoomSlider position="top-left" />
                {/* <MiniMap /> */}
                {ToastComponent}
            </ReactFlow>
            <FlowScrollModeButton
                scrollMode={scrollMode}
                handleToggleScrollMode={handleToggleScrollMode}
            />
        </div>
    );
};

export default memo(GraphView);
