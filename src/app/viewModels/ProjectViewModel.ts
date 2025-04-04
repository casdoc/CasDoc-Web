import { useState, useEffect, useCallback } from "react";
import { Project } from "@/app/models/entity/Project";
import { Document } from "@/app/models/entity/Document";
import { ProjectService } from "@/app/models/services/ProjectService";
import { DocumentService } from "@/app/models/services/DocumentService";
import { DocumentType } from "@/app/models/enum/DocumentType";
import { v4 as uuidv4 } from "uuid";
import defaultContent from "../models/default-value/defaultContent";
import { ProjectUpdate } from "../models/types/ProjectUpdate";
import { DocumentUpdate } from "../models/types/DocumentUpdate";

export interface ProjectViewModel {
    projects: Project[];
    selectedProjectId: string | null;
    selectedDocumentId: string | null;
    editingProject: Project | null;
    editingDocument: Document | null;

    // Project actions
    createProject: (name: string) => void;
    deleteProject: (projectId: string) => void;
    editProject: (projectId: string, update: ProjectUpdate) => void;
    selectProject: (projectId: string) => void;

    // Document actions
    getDocumentsByProjectId: (projectId: string) => Document[];
    createDocument: (projectId: string, name: string) => void;
    deleteDocument: (documentId: string) => void;
    editDocument: (documentId: string, update: DocumentUpdate) => void;
    selectDocument: (documentId: string) => void;

    // Dialog actions
    openEditProjectDialog: (projectId: string) => void;
    openEditDocumentDialog: (documentId: string) => void;
    closeEditProjectDialog: () => void;
    closeEditDocumentDialog: () => void;
}

export const useProjectViewModel = (): ProjectViewModel => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
        null
    );
    const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
        null
    );
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [editingDocument, setEditingDocument] = useState<Document | null>(
        null
    );

    // Load projects from localStorage and set default content
    useEffect(() => {
        const loadedProjects = ProjectService.getAllProjects();
        setProjects(loadedProjects);

        // Set default content
        if (loadedProjects.length === 0) {
            const defaultProject = new Project(
                uuidv4(),
                new Date(),
                new Date(),
                "My First Project",
                "Default project"
            );
            ProjectService.saveProject(defaultProject);

            // Create a default document
            const defaultDoc = new Document(
                uuidv4(),
                new Date(),
                new Date(),
                DocumentType.SRD,
                defaultProject.id,
                "Untitled Document",
                "No description",
                defaultContent
            );
            DocumentService.saveDocument(defaultDoc);

            setProjects([defaultProject]);
        }
    }, []);

    // Project Actions
    const createProject = useCallback((name: string) => {
        const newProject = new Project(
            uuidv4(),
            new Date(),
            new Date(),
            name,
            "No description"
        );
        ProjectService.saveProject(newProject);

        // Update local state
        setProjects((prevProjects) => [...prevProjects, newProject]);
        // Select the new project
        setSelectedProjectId(newProject.id);
    }, []);
    const deleteProject = useCallback(
        (projectId: string) => {
            if (selectedProjectId === projectId) setSelectedProjectId(null);
            ProjectService.deleteProject(projectId);

            // Update local state
            setProjects((prevProjects) =>
                prevProjects.filter((proj) => proj.id !== projectId)
            );
        },
        [selectedProjectId]
    );
    const editProject = useCallback(
        (projectId: string, update: ProjectUpdate) => {
            ProjectService.updateProject(projectId, update);
        },
        []
    );
    const selectProject = useCallback((projectId: string) => {
        setSelectedProjectId(projectId);
    }, []);

    // Document Actions
    const getDocumentsByProjectId = useCallback(
        (projectId: string): Document[] => {
            return ProjectService.getDocumentsByProjectId(projectId);
        },
        []
    );
    const createDocument = useCallback((projectId: string, name: string) => {
        const newDocument = new Document(
            uuidv4(),
            new Date(),
            new Date(),
            DocumentType.SRD,
            projectId,
            name,
            "No description",
            []
        );
        DocumentService.saveDocument(newDocument);

        // Select the new document
        setSelectedDocumentId(newDocument.id);
    }, []);
    const deleteDocument = useCallback(
        (documentId: string) => {
            DocumentService.deleteDocument(documentId);
            if (selectedDocumentId === documentId) setSelectedDocumentId(null);
        },
        [selectedDocumentId]
    );
    const editDocument = useCallback(
        (documentId: string, update: DocumentUpdate) => {
            DocumentService.updateDocument(documentId, update);
        },
        []
    );
    const selectDocument = useCallback((documentId: string) => {
        setSelectedDocumentId(documentId);
    }, []);

    // Dialog Actions
    const openEditProjectDialog = useCallback((projectId: string) => {
        const project = ProjectService.getProjectById(projectId);
        if (project) setEditingProject(project);
    }, []);
    const openEditDocumentDialog = useCallback((documentId: string) => {
        const document = DocumentService.getDocumentById(documentId);
        if (document) setEditingDocument(document);
    }, []);
    const closeEditProjectDialog = useCallback(() => {
        setEditingProject(null);
    }, []);
    const closeEditDocumentDialog = useCallback(() => {
        setEditingDocument(null);
    }, []);

    return {
        projects,
        selectedProjectId,
        selectedDocumentId,
        editingProject,
        editingDocument,
        createProject,
        deleteProject,
        editProject,
        selectProject,
        getDocumentsByProjectId,
        createDocument,
        deleteDocument,
        editDocument,
        selectDocument,
        openEditProjectDialog,
        openEditDocumentDialog,
        closeEditProjectDialog,
        closeEditDocumentDialog,
    };
};
