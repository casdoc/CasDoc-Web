"use client";

import { useRef, useEffect, useCallback } from "react";
import {
    ReactFlow,
    useNodesState,
    useEdgesState,
    addEdge,
    Background,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
interface ProjectTreeViewProps {}
const initialNodes = [
    { id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
    { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } },
];

const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

const ProjectTreeView = ({}: ProjectTreeViewProps) => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );
    return (
        <div
            style={{ width: "100%", height: "100vh" }}
            className="bg-white rounded-lg"
        >
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
            >
                <Background variant="dots" gap={12} size={1} />
            </ReactFlow>
        </div>
    );
};

export default ProjectTreeView;
