"use client";

import { useCallback, useEffect, useState } from "react";
import {
    ReactFlow,
    useNodesState,
    useEdgesState,
    addEdge,
    Background,
    Panel,
    MarkerType,
} from "@xyflow/react";
import { PiTreeStructureLight } from "react-icons/pi";
import { FaRegMoon } from "react-icons/fa";
import { IoSunny } from "react-icons/io5";
import "@xyflow/react/dist/style.css";

import { ZoomSlider } from "./zoom-slider/zoom-slider";
import { dataItems } from "./demo-data/NodeItems";
import { getLayoutedElements } from "./utils/getLayoutedElements";
import { computeProximityEdges } from "./utils/computeProximityEdges";
import {
    convertDataToNodes,
    convertDataToStructuralEdges,
} from "./utils/converter";

const defaultEdgeOptions = {
    type: "default",
    markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "#b1b1b7",
    },
};

const FlowView = () => {
    const [colorMode, setColorMode] = useState<"light" | "dark">("light");
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
                colorMode={colorMode}
                defaultEdgeOptions={defaultEdgeOptions}
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
                            <PiTreeStructureLight
                                size={20}
                                className={`${key === "TB" && "rotate-90"}`}
                            />
                        </button>
                    ))}
                    <button
                        onClick={() =>
                            setColorMode(
                                colorMode === "light" ? "dark" : "light"
                            )
                        }
                        className="bg-gray-400 mr-3 p-2 rounded-md text-white shadow-md hover:opacity-70"
                    >
                        {colorMode === "dark" ? (
                            <FaRegMoon size={20} />
                        ) : (
                            <IoSunny size={20} />
                        )}
                    </button>
                </Panel>
                <ZoomSlider position="top-left" />
            </ReactFlow>
        </div>
    );
};

export default FlowView;
