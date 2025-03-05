"use client";

import { useCallback, useEffect } from "react";
import {
    ReactFlow,
    useNodesState,
    useEdgesState,
    addEdge,
    Background,
    Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Block } from "@/app/models/types/Block";
import { BlockViewModel } from "@/app/viewModels/BlockViewModel";
import dagre from "@dagrejs/dagre";

const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutedElements = (nodes: any[], edges: any[], direction = "LR") => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    const isHorizontal = direction === "LR";
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        return {
            ...node,
            targetPosition: isHorizontal ? "left" : "top",
            sourcePosition: isHorizontal ? "right" : "bottom",
            position: {
                x: nodeWithPosition.x - nodeWidth / 2,
                y: nodeWithPosition.y - nodeHeight / 2,
            },
        };
    });

    return { nodes: layoutedNodes, edges };
};

interface FlowViewProps {
    blockViewModel: BlockViewModel;
}

const FlowView = ({ blockViewModel }: FlowViewProps) => {
    const { blocks } = blockViewModel;

    const convertBlocksToNodes = (blocks: Block[]) => {
        const defaultPosition = { x: 0, y: 0 };
        return blocks
            .filter((block) => {
                if (typeof block.content === "string") {
                    return block.content.trim() !== "";
                }
                return true;
            })
            .map((block, _) => ({
                id: block.id.toString(),
                position: defaultPosition,
                data: { label: block.topic || `${block.content}` },
            }));
    };

    const convertBlocksToEdges = (blocks: Block[]) => {
        const edges = [];
        for (let i = 1; i < blocks.length; i++) {
            edges.push({
                id: `e-${blocks[0].id}-${blocks[i].id}`,
                source: blocks[0].id.toString(),
                target: blocks[i].id.toString(),
            });
        }
        return edges;
    };

    const initialNodes = convertBlocksToNodes(blocks);
    const initialEdges = convertBlocksToEdges(blocks);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    useEffect(() => {
        const newNodes = convertBlocksToNodes(blocks);
        const newEdges = convertBlocksToEdges(blocks);
        const defaultType = "LR";
        const { nodes: layoutedNodes, edges: layoutedEdges } =
            getLayoutedElements(newNodes, newEdges, defaultType);
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
    }, [blocks, setNodes, setEdges]);

    const onConnect = useCallback(
        (params: any) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    const onLayout = useCallback(
        (direction: string) => {
            const { nodes: layoutedNodes, edges: layoutedEdges } =
                getLayoutedElements(nodes, edges, direction);
            setNodes([...layoutedNodes]);
            setEdges([...layoutedEdges]);
        },
        [nodes, edges, setNodes, setEdges]
    );

    return (
        <div className="w-full h-screen bg-white rounded-lg">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
            >
                <Background variant={"dots" as any} gap={12} size={1} />
                <Panel position="top-right">
                    {["TB", "LR"].map((key, _) => (
                        <button
                            key={key}
                            onClick={() => onLayout(key)}
                            className="bg-gray-400 mr-3 p-2 rounded-md text-white shadow-md"
                        >
                            Vertical Layout
                        </button>
                    ))}
                </Panel>
            </ReactFlow>
        </div>
    );
};

export default FlowView;
