"use client";

import { useCallback, useEffect } from "react";
import {
    ReactFlow,
    useNodesState,
    useEdgesState,
    addEdge,
    Background,
    ConnectionLineType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Block } from "@/app/models/types/Block";
import { BlockViewModel } from "@/app/viewModels/BlockViewModel";
import dagre from "@dagrejs/dagre";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutedElements = (nodes: any[], edges: any[], direction = "TB") => {
    const isHorizontal = direction === "LR";
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    nodes.forEach((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        node.targetPosition = isHorizontal ? "left" : "top";
        node.sourcePosition = isHorizontal ? "right" : "bottom";

        node.position = {
            x: nodeWithPosition.x - nodeWidth / 2,
            y: nodeWithPosition.y - nodeHeight / 2,
        };
    });

    return { nodes, edges };
};

interface FlowViewProps {
    blockViewModel: BlockViewModel;
}

const FlowView = ({ blockViewModel }: FlowViewProps) => {
    const { blocks } = blockViewModel;

    const convertBlocksToNodes = (blocks: Block[]) => {
        return blocks
            .filter((block) => {
                if (typeof block.content === "string") {
                    return block.content.trim() !== "";
                }
                return true;
            })
            .map((block, index) => ({
                id: block.id.toString(),
                // 若 block 中有自訂 position，就先使用，否則暫時給個預設值，後續再用 dagre layout 重新計算
                position: block.position ?? { x: 150 * index, y: 100 },
                data: { label: block.topic || `${block.content}` },
            }));
    };

    const convertBlocksToEdges = (blocks: Block[]) => {
        const edges = [];
        for (let i = 0; i < blocks.length - 1; i++) {
            edges.push({
                id: `e-${blocks[i].id}-${blocks[i + 1].id}`,
                source: blocks[i].id.toString(),
                target: blocks[i + 1].id.toString(),
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
        const { nodes: layoutedNodes, edges: layoutedEdges } =
            getLayoutedElements(newNodes, newEdges);
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
    }, [blocks, setNodes, setEdges]);

    const onConnect = useCallback(
        (params: any) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    return (
        <div className="w-full h-screen bg-white rounded-lg">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                connectionLineType={ConnectionLineType.SmoothStep}
                fitView
            >
                <Background variant={"dots" as any} gap={12} size={1} />
            </ReactFlow>
        </div>
    );
};

export default FlowView;
