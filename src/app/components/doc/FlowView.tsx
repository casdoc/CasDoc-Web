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
import dagre from "@dagrejs/dagre";

const nodeWidth = 172;
const nodeHeight = 36;

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

interface DataItems {
    id: number;
    content: string;
    topic: string;
    parentId: number;
}

const dataItems: DataItems[] = [
    { id: 1, content: "SDD", topic: "SDD", parentId: 1 },

    { id: 2, content: "引言與範圍", topic: "SDD", parentId: 1 },
    { id: 3, content: "目的", topic: "SDD", parentId: 2 },
    { id: 4, content: "文件範圍", topic: "SDD", parentId: 2 },

    { id: 5, content: "系統概述", topic: "SDD", parentId: 1 },
    { id: 6, content: "系統架構", topic: "SDD", parentId: 5 },
    { id: 7, content: "系統需求概述", topic: "SDD", parentId: 5 },

    { id: 8, content: "詳細設計", topic: "SDD", parentId: 1 },
    { id: 9, content: "模組設計", topic: "SDD", parentId: 8 },
    { id: 10, content: "API 設計", topic: "SDD", parentId: 8 },
    { id: 11, content: "演算法設計", topic: "SDD", parentId: 8 },

    { id: 12, content: "資料庫設計", topic: "SDD", parentId: 1 },
    { id: 13, content: "資料模型", topic: "SDD", parentId: 12 },
    { id: 14, content: "表格設計", topic: "SDD", parentId: 12 },
    { id: 15, content: "索引與效能優化", topic: "SDD", parentId: 12 },

    { id: 16, content: "介面設計", topic: "SDD", parentId: 1 },
    { id: 17, content: "前端 UI 設計", topic: "SDD", parentId: 16 },
    { id: 18, content: "後端 API 介面", topic: "SDD", parentId: 16 },

    { id: 19, content: "安全性與效能考量", topic: "SDD", parentId: 1 },
    { id: 20, content: "身份驗證與授權", topic: "SDD", parentId: 19 },
    { id: 21, content: "效能最佳化", topic: "SDD", parentId: 19 },

    { id: 22, content: "測試計劃與驗收策略", topic: "SDD", parentId: 1 },
    { id: 23, content: "單元測試", topic: "SDD", parentId: 22 },
    { id: 24, content: "整合測試", topic: "SDD", parentId: 22 },
    { id: 25, content: "驗收測試", topic: "SDD", parentId: 22 },

    { id: 26, content: "附錄", topic: "SDD", parentId: 1 },
    { id: 27, content: "術語表", topic: "SDD", parentId: 26 },
    { id: 28, content: "參考文件", topic: "SDD", parentId: 26 },
];

const convertDataToNodes = (data: DataItems[]) => {
    const defaultPosition = { x: 0, y: 0 };
    return data
        .filter((item) => {
            if (typeof item.content === "string") {
                return item.content.trim() !== "";
            }
            return true;
        })
        .map((item) => ({
            id: item.id.toString(),
            position: defaultPosition,
            data: { label: item.content },
        }));
};

const convertDataToStructuralEdges = (data: DataItems[]) => {
    const edges = [];
    if (data.length > 0) {
        for (let i = 1; i < data.length; i++) {
            edges.push({
                id: `e-${data[i].parentId}-${data[i].id}`,
                source: data[i].parentId!.toString(),
                target: data[i].id.toString(),
                arrowHeadType: "arrowclosed",
            });
        }
    }
    return edges;
};

const FlowView = () => {
    const initialNodes = convertDataToNodes(dataItems);
    const initialStructuralEdges = convertDataToStructuralEdges(dataItems);
    const { nodes: layoutedNodes } = getLayoutedElements(
        initialNodes,
        initialStructuralEdges,
        "LR"
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
            "LR"
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
        (direction: "LR" | "TB") => {
            const newNodes = convertDataToNodes(dataItems);
            const newStructuralEdges = convertDataToStructuralEdges(dataItems);
            const { nodes: layoutedNodes } = getLayoutedElements(
                newNodes,
                newStructuralEdges,
                direction
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
