// FlowService.ts
import { Node, Edge } from "@xyflow/react";

export interface FlowData {
    nodes: Node[];
    edges: Edge[];
}

const STORAGE_KEY = "flowData";

export class FlowService {
    // 從 localStorage 取得 FlowData
    static getFlowData(): FlowData {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
            try {
                return JSON.parse(data) as FlowData;
            } catch (error) {
                console.error("解析 flow data 失敗", error);
                return { nodes: [], edges: [] };
            }
        }
        return { nodes: [], edges: [] };
    }

    // 將 FlowData 存到 localStorage
    static setFlowData(flowData: FlowData): void {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(flowData));
        } catch (error) {
            console.error("存取 flow data 到 local storage 失敗", error);
        }
    }

    // 取得 nodes
    static getNodes(): Node[] {
        return this.getFlowData().nodes;
    }

    // 取得 edges
    static getEdges(): Edge[] {
        return this.getFlowData().edges;
    }

    // 單獨存 nodes，保留現有 edges
    static setNodes(nodes: Node[]): void {
        const flowData = this.getFlowData();
        flowData.nodes = nodes;
        this.setFlowData(flowData);
    }

    // 單獨存 edges，保留現有 nodes
    static setEdges(edges: Edge[]): void {
        const flowData = this.getFlowData();
        flowData.edges = edges;
        this.setFlowData(flowData);
    }
}
