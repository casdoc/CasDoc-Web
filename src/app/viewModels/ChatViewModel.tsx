import { useState } from "react";
import { ProjectService } from "@/app/models/services/ProjectService";

interface AgentNode {
    id: string;
    title: string;
}

// Connection data interface for agent communication
export interface ConnectionData {
    source: string;
    target: string;
    label?: string;
    data: { bidirectional: boolean; offset: number };
}

// Document data interface for agent communication
export interface DocumentData {
    id: string;
    title: string;
    description?: string;
    type: "SRD" | "SDD" | "STD" | "OTHER";
    content?: string;
}

// Project data interface for agent communication
export interface ProjectData {
    id: string;
    project_name?: string;
    project_description?: string;
    documents?: DocumentData[];
    connections?: ConnectionData[];
}

export interface ChatViewModel {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    componentChangeApply: (componentId: string, nodeJson: any) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    componentAddAI: (componentId: string, nodeJson: any) => void;
    addToAgentNodeIds: AgentNode[];
    addNodeToAgent: (nodeId: string, title: string) => void;
    removeNodeFromAgent: (nodeId: string) => void;
    getProjectAllDataById: (projectId: string) => ProjectData | null;
}

export const useChatViewModel = (): ChatViewModel => {
    const [isOpen, setIsOpen] = useState(false);
    const [addToAgentNodeIds, setAddToAgentNodeIds] = useState<AgentNode[]>([]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const componentChangeApply = (componentId: string, nodeJson: any) => {
        // Dispatch the event to update the component
        window.dispatchEvent(
            new CustomEvent("ai-apply-update-component", {
                detail: { componentId, nodeJson },
            })
        );
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const componentAddAI = (componentId: string, nodeJson: any) => {
        // Dispatch the event to add a new component after the target component
        window.dispatchEvent(
            new CustomEvent("ai-add-component", {
                detail: { componentId, nodeJson },
            })
        );
    };

    const addNodeToAgent = (nodeId: string, title: string) => {
        setAddToAgentNodeIds((prev) => {
            if (!prev.some((node) => node.id === nodeId)) {
                return [...prev, { id: nodeId, title }];
            }
            return prev;
        });
    };

    const removeNodeFromAgent = (nodeId: string) => {
        setAddToAgentNodeIds(
            addToAgentNodeIds.filter((node) => node.id !== nodeId)
        );
    };

    const getProjectAllDataById = (projectId: string): ProjectData | null => {
        try {
            const project = ProjectService.getProjectById(projectId);
            if (!project) return null;

            const documents = ProjectService.getDocumentsByProjectId(projectId);

            const documentDataList = documents.map((doc) => ({
                id: doc.id,
                title: doc.title,
                description: doc.description,
                type: doc.type as "SRD" | "SDD" | "STD" | "OTHER",
                content: doc.content ? JSON.stringify(doc.content) : undefined,
            }));

            const projectData: ProjectData = {
                id: project.id,
                project_name: project.name,
                project_description: project.description,
                documents: documentDataList,
            };

            // console.log("Project data:", projectData);
            return projectData;
        } catch (error) {
            console.error("Error retrieving project data:", error);
            return null;
        }
    };

    return {
        isOpen,
        setIsOpen,
        componentChangeApply,
        componentAddAI,
        addToAgentNodeIds,
        addNodeToAgent,
        removeNodeFromAgent,
        getProjectAllDataById,
    };
};
