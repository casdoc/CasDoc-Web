import { useState, useEffect, useCallback } from "react";
import { Project } from "@/app/models/entity/Project";
import { Document } from "@/app/models/entity/Document";
import { ProjectService } from "@/app/models/services/ProjectService";
import { DocumentService } from "@/app/models/services/DocumentService";
import { DocumentType } from "@/app/models/enum/DocumentType";
import defaultContent from "../models/default-value/defaultContent";
import { ProjectInput } from "../models/types/ProjectInput";
import { DocumentInput } from "../models/types/DocumentInput";

export interface ProjectViewModel {
    projects: Project[];
    documentsMap: Record<string, Document[]>;
    selectedProjectId: string | null;
    selectedDocumentId: string | null;
    editingProject: Project | null;
    editingDocument: Document | null;

    // Project actions
    createProject: (input: ProjectInput) => string;
    deleteProject: (projectId: string) => void;
    editProject: (projectId: string, update: ProjectInput) => void;
    selectProject: (projectId: string) => void;

    // Document actions
    getDocumentsByProjectId: (projectId: string) => Document[];
    createDocument: (input: DocumentInput) => string;
    deleteDocument: (documentId: string) => void;
    editDocument: (documentId: string, update: DocumentInput) => void;
    selectDocument: (documentId: string) => void;

    // Dialog actions
    openEditProjectDialog: (projectId: string) => void;
    openEditDocumentDialog: (documentId: string) => void;
    closeEditProjectDialog: () => void;
    closeEditDocumentDialog: () => void;
}

export const useProjectViewModel = (): ProjectViewModel => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [documentsMap, setDocumentsMap] = useState<
        Record<string, Document[]>
    >({});
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
        // Set default content
        if (loadedProjects.length === 0) {
            const defaultProject = ProjectService.createProject({
                name: "My First Project",
                description: "Default project",
            } as ProjectInput);
            if (!defaultProject) return;

            // Create a default document
            const defaultDoc = DocumentService.createDocument({
                type: DocumentType.SRD,
                projectId: defaultProject.id,
                title: "Untitled Document",
                description: "No description",
                content: defaultContent,
            } as DocumentInput);
            if (!defaultDoc) return;

            // Update local state
            setProjects([defaultProject]);
            setDocumentsMap((prev) => ({
                ...prev,
                [defaultDoc.projectId]: [
                    ...(prev[defaultDoc.projectId] || []),
                    defaultDoc,
                ],
            }));
        } else {
            // Update local state
            setProjects(loadedProjects);
            loadedProjects.forEach((proj) => {
                documentsMap[proj.id] = ProjectService.getDocumentsByProjectId(
                    proj.id
                );
            });
        }
    }, [documentsMap]);

    // Project Actions
    const createProject = useCallback((input: ProjectInput): string => {
        const project = ProjectService.createProject(input);
        if (!project) throw new Error("Failed to create project");

        // Update local state
        setProjects((prev) => [...prev, project]);
        return project.id;
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
        (projectId: string, update: ProjectInput) => {
            ProjectService.updateProject(projectId, update);
            setProjects((prevProjects) =>
                prevProjects.map((proj) =>
                    proj.id === projectId
                        ? ({ ...proj, ...update } as Project)
                        : proj
                )
            );
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
    const createDocument = useCallback((input: DocumentInput): string => {
        const document = DocumentService.createDocument(input);
        if (!document) throw new Error("Failed to create document");

        setDocumentsMap((prev) => ({
            ...prev,
            [document.projectId]: [
                ...(prev[document.projectId] || []),
                document,
            ],
        }));
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
            setDocumentsMap((prev) => ({
                ...prev,
                [projectId]: (prev[projectId] || []).filter(
                    (doc) => doc.id !== documentId
                ),
            }));
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
            setDocumentsMap((prev) => ({
                ...prev,
                [projectId]: (prev[projectId] || []).map((doc) =>
                    doc.id === documentId
                        ? ({ ...doc, ...update } as Document)
                        : doc
                ),
            }));
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
        console.log(projectId);
        console.log(project);
    }, []);
    const openEditDocumentDialog = useCallback((documentId: string) => {
        const document = DocumentService.getDocumentById(documentId);
        if (document) setEditingDocument(document);
        console.log(documentId);
        console.log(document);
    }, []);
    const closeEditProjectDialog = useCallback(() => {
        setEditingProject(null);
    }, []);
    const closeEditDocumentDialog = useCallback(() => {
        setEditingDocument(null);
    }, []);

    return {
        projects,
        documentsMap,
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
