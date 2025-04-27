import { useState, useEffect, useCallback } from "react";
import { Project } from "@/app/models/entity/Project";
import { Document } from "@/app/models/types/Document";
import { DocSelectedService } from "../models/services/DocSelectedService";
import { useProjectsQuery } from "./hooks/useProjectsQuery";
import { useDocumentsQuery } from "./hooks/useDocumentsQuery";
// import defaultContent from "../models/default-value/defaultContent";

export interface ProjectViewModel {
    selectedProjectId: string | null;
    selectedDocumentId: string | null;
    isProjectDialogOpen: boolean;
    isDocumentDialogOpen: boolean;
    editingProject: Project | null;
    editingDocument: Document | null;

    // Project actions
    selectProject: (projectId: string) => void;

    // Document actions
    selectDocument: (documentId: string) => void;

    // Dialog actions
    openProjectDialog: (projectId?: string) => void;
    openDocumentDialog: (projectId: string, documentId?: string) => void;
    closeProjectDialog: () => void;
    closeDocumentDialog: () => void;
}

export const useProjectViewModel = (): ProjectViewModel => {
    const { data: projects, isLoading: isLoadingProjects } = useProjectsQuery();
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
        null
    );
    const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
        null
    );
    const { data: documents } = useDocumentsQuery(selectedProjectId || "");
    const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
    const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [editingDocument, setEditingDocument] = useState<Document | null>(
        null
    );

    // console.debug("documents", documents);
    // console.debug("projects", projects);
    // console.debug("selectedProjectId", selectedProjectId);
    useEffect(() => {
        const localSelectedDoc = DocSelectedService.getSelectedDoc();
        if (localSelectedDoc === "") {
            // console.debug("localSelectedDoc is empty");
            if (projects && projects.length > 0 && projects[0].id) {
                // console.debug("projects is not empty");
                // console.debug("selectProjectId", projects[0].id);
                setSelectedProjectId(projects[0].id);
                // Use the first project to get documents
                // setSelectedProjectId(projects[0].id);

                // console.debug("selectedProjectId", selectedProjectId);
                if (documents && documents.length > 0) {
                    setSelectedDocumentId(documents[0]?.id || null);
                    setEditingDocument(documents[0] || null);
                    // console.debug("selectDocument", selectedDocumentId);
                }
            }
        } else if (selectedDocumentId !== localSelectedDoc) {
            // console.debug("loclalSelectedDoc is not empty");
            // setSelectedProjectId(projects[0].id);
            setSelectedDocumentId(localSelectedDoc);
        }
    }, [projects, documents, selectedDocumentId, selectedProjectId]);

    const selectProject = useCallback((projectId: string) => {
        setSelectedProjectId(projectId);
    }, []);

    const selectDocument = useCallback((documentId: string) => {
        setSelectedDocumentId(documentId);
        DocSelectedService.setSelectedDoc(documentId);
    }, []);

    // Dialog Actions
    const openProjectDialog = useCallback(
        (projectId?: string) => {
            setIsProjectDialogOpen(true);
            setEditingProject(
                projects?.find((project) => project.id == projectId) || null
            );
        },
        [projects]
    );

    const openDocumentDialog = useCallback(
        (projectId: string, documentId?: string) => {
            setIsDocumentDialogOpen(true);
            setEditingProject(
                projects?.find((project) => project.id === projectId) || null
            );
            setEditingDocument(
                documents?.find((document) => document.id === documentId) ||
                    null
            );
        },
        [projects, documents]
    );

    const closeProjectDialog = useCallback(() => {
        setIsProjectDialogOpen(false);
        setTimeout(() => {
            setEditingProject(null);
        }, 0);
    }, []);

    const closeDocumentDialog = useCallback(() => {
        setIsDocumentDialogOpen(false);
        setTimeout(() => {
            setEditingProject(null);
            setEditingDocument(null);
        }, 0);
    }, []);

    return {
        selectedProjectId,
        selectedDocumentId,
        isProjectDialogOpen,
        isDocumentDialogOpen,
        editingProject,
        editingDocument,
        selectProject,
        selectDocument,
        openProjectDialog,
        openDocumentDialog,
        closeProjectDialog,
        closeDocumentDialog,
    };
};
