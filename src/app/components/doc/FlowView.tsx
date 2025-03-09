"use client";

import { useCallback, useEffect } from "react";
import {
    ReactFlow,
    useNodesState,
    useEdgesState,
    addEdge,
    Background,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
// import { Block } from "@/app/models/types/Block";
// import { BlockViewModel } from "@/app/viewModels/BlockViewModel";

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
        setNodes(convertBlocksToNodes(blocks));
        setEdges(convertBlocksToEdges(blocks));
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
            >
                <Background variant={"dots" as any} gap={12} size={1} />
            </ReactFlow>
        </div>
    );
};

export default FlowView;
