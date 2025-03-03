import { useState, useCallback } from "react";
import { Node, Edge, addEdge } from "@xyflow/react";

export interface FlowViewModel {
    nodes: Node[];
    edges: Edge[];
    setNodes: (nodes: Node[]) => void;
    setEdges: (edges: Edge[]) => void;
    updateNodePosition: (
        id: string,
        position: { x: number; y: number }
    ) => void;
    addNewEdge: (params: any) => void;
}

export function useFlowViewModel(): FlowViewModel {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);

    // 根據 id 更新指定 node 的 position
    const updateNodePosition = useCallback(
        (id: string, position: { x: number; y: number }) => {
            setNodes((prevNodes) =>
                prevNodes.map((node) =>
                    node.id === id ? { ...node, position } : node
                )
            );
        },
        []
    );

    // 新增邊
    const addNewEdge = useCallback((params: any) => {
        setEdges((prevEdges) => addEdge(params, prevEdges));
    }, []);

    return { nodes, edges, setNodes, setEdges, updateNodePosition, addNewEdge };
}
