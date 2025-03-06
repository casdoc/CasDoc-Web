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

// 使用 structuralEdges (樹狀連線) 作為 dagre layout 的依據，不受 proximity edges 影響
const getLayoutedElements = (
    nodes: any[],
    structuralEdges: any[],
    direction = "LR"
) => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    const isHorizontal = direction === "LR";
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    structuralEdges.forEach((edge) => {
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

    return { nodes: layoutedNodes, structuralEdges };
};

// 根據 proximity（近距離）產生額外連線，若兩個節點距離小於 threshold，就連線
const computeProximityEdges = (nodes: any[], threshold: number = 200) => {
    if (!nodes || nodes.length === 0) return [];
    const parent = nodes[0];
    const proxEdges = [];
    for (let i = 1; i < nodes.length; i++) {
        const dx = parent.position.x - nodes[i].position.x;
        const dy = parent.position.y - nodes[i].position.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < threshold) {
            proxEdges.push({
                id: `e-${parent.id}-${nodes[i].id}-prox`,
                source: parent.id,
                target: nodes[i].id,
                arrowHeadType: "arrowclosed",
            });
        }
    }
    return proxEdges;
};

interface FlowViewProps {
    blockViewModel: BlockViewModel;
}

const FlowView = ({ blockViewModel }: FlowViewProps) => {
    const { blocks } = blockViewModel;

    // 將 blocks 轉換為 nodes，初始位置預設為 { x: 0, y: 0 }，後續由 dagre 調整
    const convertBlocksToNodes = (blocks: Block[]) => {
        return blocks
            .filter((block) => {
                if (typeof block.content === "string") {
                    return block.content.trim() !== "";
                }
                return true;
            })
            .map((block) => ({
                id: block.id.toString(),
                position: { x: 0, y: 0 },
                data: { label: block.topic || `${block.content}` },
            }));
    };

    // 建立 structural edges（樹狀連線）：假設第一個 block 為根節點，其餘皆為子節點
    const convertBlocksToStructuralEdges = (blocks: Block[]) => {
        const edges = [];
        if (blocks.length > 0) {
            for (let i = 1; i < blocks.length; i++) {
                edges.push({
                    id: `e-${blocks[0].id}-${blocks[i].id}`,
                    source: blocks[0].id.toString(),
                    target: blocks[i].id.toString(),
                    arrowHeadType: "arrowclosed",
                });
            }
        }
        return edges;
    };

    const initialNodes = convertBlocksToNodes(blocks);
    const initialStructuralEdges = convertBlocksToStructuralEdges(blocks);
    // 先進行 dagre 排版，僅依據 structuralEdges，不包括 proximity edges
    const { nodes: layoutedNodes } = getLayoutedElements(
        initialNodes,
        initialStructuralEdges,
        "LR"
    );
    // 依據排版後的節點位置，計算 proximity edges
    const initialProximityEdges = computeProximityEdges(layoutedNodes);
    // 最終 edges 為 structural 與 proximity edges 的合併
    const initialEdges = [...initialStructuralEdges, ...initialProximityEdges];

    const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    // 當 blocks 改變時，重新計算 nodes 與 edges
    useEffect(() => {
        const newNodes = convertBlocksToNodes(blocks);
        const newStructuralEdges = convertBlocksToStructuralEdges(blocks);
        const { nodes: layoutedNodes } = getLayoutedElements(
            newNodes,
            newStructuralEdges,
            "LR"
        );
        const newProximityEdges = computeProximityEdges(layoutedNodes);
        setNodes(layoutedNodes);
        setEdges([...newStructuralEdges, ...newProximityEdges]);
    }, [blocks, setNodes, setEdges]);

    const onConnect = useCallback(
        (params: any) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    // layout 切換函式：重新以指定方向排版，並重新計算 proximity edges
    const onLayout = useCallback(
        (direction: "LR" | "TB") => {
            const newNodes = convertBlocksToNodes(blocks);
            const newStructuralEdges = convertBlocksToStructuralEdges(blocks);
            const { nodes: layoutedNodes } = getLayoutedElements(
                newNodes,
                newStructuralEdges,
                direction
            );
            const newProximityEdges = computeProximityEdges(layoutedNodes);
            setNodes(layoutedNodes);
            setEdges([...newStructuralEdges, ...newProximityEdges]);
        },
        [blocks, setNodes, setEdges]
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
                    <button
                        onClick={() => onLayout("TB")}
                        className="bg-gray-400 mr-3 p-2 rounded-md text-white shadow-md"
                    >
                        Vertical Layout
                    </button>
                    <button
                        onClick={() => onLayout("LR")}
                        className="bg-gray-400 mr-3 p-2 rounded-md text-white shadow-md"
                    >
                        Horizontal Layout
                    </button>
                </Panel>
            </ReactFlow>
        </div>
    );
};

export default FlowView;
