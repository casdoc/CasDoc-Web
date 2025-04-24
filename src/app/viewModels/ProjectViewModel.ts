import { useState, useEffect, useCallback, useMemo } from "react";
import { Project } from "@/app/models/entity/Project";
import { Document } from "@/app/models/types/Document";
import { ProjectService } from "@/app/models/services/ProjectService";
import { DocumentService } from "@/app/models/services/DocumentService";
import defaultContent from "../models/default-value/defaultContent";
import { DocumentInput } from "../models/types/DocumentInput";
import { DocSelectedService } from "../models/services/DocSelectedService";
import { useProjectsQuery } from "./hooks/useProjectsQuery";
import { useDocumentsQuery } from "./hooks/useDocumentsQuery";
import { useQueryClient } from "@tanstack/react-query";

export interface ProjectViewModel {
    selectedProjectId: string | null;
    selectedDocumentId: string | null;
    isProjectDialogOpen: boolean;
    isDocumentDialogOpen: boolean;
    editingProject: Project | null;
    editingDocument: Document | null;

    // Project actions
    selectProject: (projectId: string) => void;
    // getProjectByDocumentId: (documentId: string) => Project | undefined;

    // Document actions
    createDocument: (input: DocumentInput) => string;
    deleteDocument: (documentId: string) => void;
    editDocument: (documentId: string, update: DocumentInput) => void;
    selectDocument: (documentId: string) => void;
    getDocumentById: (documentId: string) => Document | undefined;

    // Dialog actions
    openProjectDialog: (projectId?: string) => void;
    openDocumentDialog: (projectId: string, documentId?: string) => void;
    closeProjectDialog: () => void;
    closeDocumentDialog: () => void;
}

export const useProjectViewModel = (): ProjectViewModel => {
    const { data: projects, isLoading: isLoadingProjects } = useProjectsQuery();
    const { getQueryData } = useQueryClient();

    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
        null
    );
    const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
        null
    );
    const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
    const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [editingDocument, setEditingDocument] = useState<Document | null>(
        null
    );
    // const projects: Project[] = useMemo(
    //     () => projectsData || [],
    //     [projectsData]
    // );
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

    // const getProjectByDocumentId = (
    //     documentId: string
    // ): Project | undefined => {
    //     for (const project of projects) {
    //         const { data: documents } = useDocumentsQuery(project.id);
    //         const doc = documents?.find((d) => d.id === documentId);
    //         if (doc) return project;
    //     }
    // };

    useEffect(() => {
        const localSelectedDoc = DocSelectedService.getSelectedDoc();
        // if (localSelectedDoc === "") {
        //     if (projects && projects[0]) {
        //         const { data: docs } = useDocumentsQuery(projects[0].id);
        //         if (docs && docs?.length > 0) {
        //             setSelectedDocumentId(docs[0].id);
        //             return;
        //         }
        //     }
        // }
        if (selectedDocumentId !== localSelectedDoc) {
            setSelectedDocumentId(localSelectedDoc);
        }
    }, [projects, selectedDocumentId]);

    const createDocument = useCallback((input: DocumentInput): string => {
        const document = DocumentService.createDocument(input);
        if (!document) throw new Error("Failed to create document");

        // setDocumentsMap((prev) => ({
        //     ...prev,
        //     [document.projectId]: [
        //         ...(prev[document.projectId] || []),
        //         document,
        //     ],
        // }));
        return document.id;
    }, []);

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
    const openProjectDialog = useCallback((projectId?: string) => {
        setIsProjectDialogOpen(true);
        // setEditingProject(
        //     projectId ? ProjectService.getProjectById(projectId) : null
        // );
    }, []);

    const openDocumentDialog = useCallback(
        (projectId: string, documentId?: string) => {
            setIsDocumentDialogOpen(true);
            // setEditingProject(ProjectService.getProjectById(projectId));
            setEditingDocument(
                documentId ? DocumentService.getDocumentById(documentId) : null
            );
        },
        []
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

    const getDocumentById = (documentId: string): Document | undefined => {
        for (const project of projects || []) {
            const documents = getQueryData(["documents", project.id]) as
                | Document[]
                | undefined;
            const doc = documents?.find((d) => d.id === documentId);
            if (doc) return doc;
        }
        return undefined;
    };

    return {
        selectedProjectId,
        selectedDocumentId,
        isProjectDialogOpen,
        isDocumentDialogOpen,
        editingProject,
        editingDocument,
        selectProject,
        // getProjectByDocumentId,
        createDocument,
        deleteDocument,
        editDocument,
        selectDocument,
        getDocumentById,
        openProjectDialog,
        openDocumentDialog,
        closeProjectDialog,
        closeDocumentDialog,
    };
};
