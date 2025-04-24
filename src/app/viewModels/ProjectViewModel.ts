import { useState, useEffect, useCallback } from "react";
import { Project } from "@/app/models/entity/Project";
import { Document } from "@/app/models/types/Document";
import { DocumentService } from "@/app/models/services/DocumentService";
import defaultContent from "../models/default-value/defaultContent";
import { DocumentInput } from "../models/types/DocumentInput";
import { DocSelectedService } from "../models/services/DocSelectedService";
import { useProjectsQuery } from "./hooks/useProjectsQuery";
import { useDocumentsQuery } from "./hooks/useDocumentsQuery";
import { useQueryClient } from "@tanstack/react-query";
import { DocumentListResponse } from "../models/dto/DocumentApiResponse";

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
    deleteDocument: (documentId: string) => void;
    editDocument: (documentId: string, update: DocumentInput) => void;
    selectDocument: (documentId: string) => void;

    // Dialog actions
    openProjectDialog: (projectId?: string) => void;
    openDocumentDialog: (projectId: string, documentId?: string) => void;
    closeProjectDialog: () => void;
    closeDocumentDialog: () => void;
}

export const useProjectViewModel = (): ProjectViewModel => {
    const { data: projects, isLoading: isLoadingProjects } = useProjectsQuery();
    const queryClient = useQueryClient();

    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
        null
    );
    const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
        null
    );
    const { data: documents } = useDocumentsQuery(
        selectedProjectId || "",
        !isLoadingProjects
    );
    const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
    const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [editingDocument, setEditingDocument] = useState<Document | null>(
        null
    );

    // Load projects from localStorage and set default content
    useEffect(() => {
        // Set default content
        if (!isLoadingProjects && projects?.length === 0) {
            // const defaultProject = ProjectService.createProject({
            //     name: "My First Project",
            //     description: "Default project",
            // } as ProjectApiRequest);
            // if (!defaultProject) return;
            // // Parse the doc title from default content
            // let docTitle = "Untitled Document";
            // if (
            //     defaultContent[0].content &&
            //     defaultContent[0].content.length > 0
            // ) {
            //     docTitle = defaultContent[0].content[0].text;
            // }
            // // Create a default document
            // const defaultDoc = DocumentService.createDocument({
            //     type: DocumentType.SRD,
            //     projectId: defaultProject.id,
            //     title: docTitle,
            //     description: "No description",
            //     content: defaultContent,
            // } as DocumentInput);
            // if (!defaultDoc) return;
            // // Update local state
            // // setProjects([defaultProject]);
            // setDocumentsMap((prev) => ({
            //     ...prev,
            //     [defaultDoc.projectId]: [
            //         ...(prev[defaultDoc.projectId] || []),
            //         defaultDoc,
            //     ],
            // }));
        } else if (projects) {
            // getDocumentsByProjectId(projects[0].id);
            // const initialDocumentsMap: Record<string, Document[]> = {};
            // projects.forEach((proj) => {
            //     initialDocumentsMap[proj.id] =
            //         ProjectService.getDocumentsByProjectId(proj.id);
            // });
            // setDocumentsMap(initialDocumentsMap);
        }
    }, [isLoadingProjects, projects]);
    const selectProject = useCallback((projectId: string) => {
        setSelectedProjectId(projectId);
    }, []);

    useEffect(() => {
        const localSelectedDoc = DocSelectedService.getSelectedDoc();
        if (localSelectedDoc === "") {
            if (projects && projects.length > 0 && projects[0].id) {
                console.debug("selectProjectId", projects[0].id);
                // Use the first project to get documents
                setSelectedProjectId(projects[0].id);
                if (documents && documents.length > 0) {
                    setSelectedDocumentId(documents[0]?.id || null);
                    console.debug("selectDocument", selectedDocumentId);
                }
            }
        } else if (selectedDocumentId !== localSelectedDoc) {
            setSelectedDocumentId(localSelectedDoc);
        }
    }, [projects, documents, selectedDocumentId, queryClient]);

    const deleteDocument = useCallback(
        (documentId: string) => {
            const projectId =
                DocumentService.getDocumentById(documentId)?.projectId;
            if (!projectId) return;

            DocumentService.deleteDocument(documentId);

            // Update local state
            if (selectedDocumentId === documentId) setSelectedDocumentId(null);
            // setDocumentsMap((prev) => ({
            //     ...prev,
            //     [projectId]: (prev[projectId] || []).filter(
            //         (doc) => doc.id !== documentId
            //     ),
            // }));
        },
        [selectedDocumentId]
    );

    const editDocument = useCallback(
        (documentId: string, update: DocumentInput) => {
            const projectId =
                DocumentService.getDocumentById(documentId)?.projectId;
            if (!projectId) return;

            DocumentService.updateDocument(documentId, update);

            // Update local state
            // setDocumentsMap((prev) => ({
            //     ...prev,
            //     [projectId]: (prev[projectId] || []).map((doc) =>
            //         doc.id === documentId
            //             ? ({ ...doc, ...update } as Document)
            //             : doc
            //     ),
            // }));
        },
        []
    );

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
        deleteDocument,
        editDocument,
        selectDocument,
        openProjectDialog,
        openDocumentDialog,
        closeProjectDialog,
        closeDocumentDialog,
    };
};
