"use client";

import { useCallback, useEffect } from "react";
import {
    ReactFlow,
    Background,
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Block } from "@/app/models/types/Block";
import { useFlowViewModel } from "@/app/viewModels/FlowViewModel";

interface ProjectTreeViewProps {
    blocks: Block[];
}

const FlowView = ({ blocks }: ProjectTreeViewProps) => {
    const flowViewModel = useFlowViewModel();

    // 將 blocks 轉成 ReactFlow 所需的 nodes 與 edges
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
                position: { x: 100 * index, y: 100 },
                data: { label: block.content },
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

    // 當 blocks 改變時，同步更新 flowViewModel 的 nodes 與 edges
    useEffect(() => {
        flowViewModel.setNodes(convertBlocksToNodes(blocks));
        flowViewModel.setEdges(convertBlocksToEdges(blocks));
    }, [blocks, flowViewModel]);

    // 處理 ReactFlow 的 onNodesChange，利用 helper applyNodeChanges
    const onNodesChange = useCallback(
        (changes: any) => {
            const newNodes = applyNodeChanges(changes, flowViewModel.nodes);
            flowViewModel.setNodes(newNodes);
        },
        [flowViewModel.nodes, flowViewModel.setNodes]
    );

    // 處理 onEdgesChange，利用 helper applyEdgeChanges
    const onEdgesChange = useCallback(
        (changes: any) => {
            const newEdges = applyEdgeChanges(changes, flowViewModel.edges);
            flowViewModel.setEdges(newEdges);
        },
        [flowViewModel.edges, flowViewModel.setEdges]
    );

    // 處理新增連線，轉交給 view model 的 addNewEdge 方法
    const onConnect = useCallback(
        (params: any) => {
            flowViewModel.addNewEdge(params);
        },
        [flowViewModel]
    );

    return (
        <div
            style={{ width: "100%", height: "100vh" }}
            className="bg-white rounded-lg"
        >
            <ReactFlow
                nodes={flowViewModel.nodes}
                edges={flowViewModel.edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
            >
                <Background variant={"dots" as any} gap={12} size={1} />
            </ReactFlow>
        </div>
    );
};

export default FlowView;
