import { useState, useEffect, useCallback } from "react";
import { Project } from "@/app/models/entity/Project";
import { Document } from "@/app/models/entity/Document";
import { ProjectService } from "@/app/models/services/ProjectService";
import { DocumentService } from "@/app/models/services/DocumentService";
import { DocumentType } from "@/app/models/enum/DocumentType";
import { v4 as uuidv4 } from "uuid";
import defaultContent from "../models/default-value/defaultContent";

export interface ProjectViewModel {
    projects: Project[];
    selectedProjectId: string | null;
    selectedDocumentId: string | null;
    // State to track documents for the current project
    currentProjectDocuments: Document[];
    // Project actions
    createProject: (name: string) => void;
    deleteProject: (projectId: string) => void;
    renameProject: (projectId: string, newName: string) => void;
    selectProject: (projectId: string) => void;

    // Document actions
    getDocumentsForProject: (projectId: string) => Document[];
    createDocument: (projectId: string, name: string) => void;
    deleteDocument: (documentId: string) => void;
    renameDocument: (documentId: string, newName: string) => void;
    selectDocument: (documentId: string) => void;
}

export function useProjectViewModel(): ProjectViewModel {
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
        null
    );
    const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
        null
    );
    const [currentProjectDocuments, setCurrentProjectDocuments] = useState<
        Document[]
    >([]);
    // Load projects from localStorage
    useEffect(() => {
        const loadedProjects = ProjectService.getAllProjects();

        // Create a default project if none exists
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
            setSelectedProjectId(defaultProject.id);
            setSelectedDocumentId(defaultDoc.id);
        } else {
            setProjects(loadedProjects);

            // If there are projects, select the first one
            if (loadedProjects.length > 0 && !selectedProjectId) {
                setSelectedProjectId(loadedProjects[0].id);

                // Get documents for the first project
                const projectDocs = ProjectService.getDocumentsByProjectId(
                    loadedProjects[0].id
                );
                if (projectDocs.length > 0) {
                    setSelectedDocumentId(projectDocs[0].id);
                }
            }
        }
    }, [selectedProjectId]);
    // Load documents for the selected project
    useEffect(() => {
        if (selectedProjectId) {
            const docs =
                ProjectService.getDocumentsByProjectId(selectedProjectId);
            setCurrentProjectDocuments(docs);

            // Select the first document if none is selected or if the selected document is not in this project
            if (
                (!selectedDocumentId ||
                    !docs.some((doc) => doc.id === selectedDocumentId)) &&
                docs.length > 0
            ) {
                setSelectedDocumentId(docs[0].id);
            }
        }
    }, [selectedProjectId, selectedDocumentId]);
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
        setSelectedDocumentId(null);
    }, []);

    const deleteProject = useCallback(
        (documentId: string) => {
            const docToDelete = DocumentService.getDocumentById(documentId);
            if (!docToDelete) return;

            DocumentService.deleteDocument(documentId);

            // Update local state for currentProjectDocuments
            setCurrentProjectDocuments((prev) =>
                prev.filter((doc) => doc.id !== documentId)
            );

            // If the deleted document was selected, select another one
            if (selectedDocumentId === documentId) {
                const projectDocs = currentProjectDocuments.filter(
                    (doc) => doc.id !== documentId
                );

                if (projectDocs.length > 0) {
                    setSelectedDocumentId(projectDocs[0].id);
                } else {
                    setSelectedDocumentId(null);
                }
            }
        },
        [currentProjectDocuments, selectedDocumentId]
    );

    const renameProject = useCallback((projectId: string, newName: string) => {
        const project = ProjectService.getProjectById(projectId);
        if (!project) return;

        project.name = newName;
        ProjectService.saveProject(project);

        // Update local state
        setProjects((prevProjects) =>
            prevProjects.map((p) => (p.id === projectId ? project : p))
        );
    }, []);

    const selectProject = useCallback((projectId: string) => {
        setSelectedProjectId(projectId);

        // Get documents for the selected project
        const projectDocs = ProjectService.getDocumentsByProjectId(projectId);
        if (projectDocs.length > 0) {
            setSelectedDocumentId(projectDocs[0].id);
        } else {
            setSelectedDocumentId(null);
        }
    }, []);

    // Document Actions
    const getDocumentsForProject = useCallback(
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
            const docToDelete = DocumentService.getDocumentById(documentId);
            if (!docToDelete) return;

            DocumentService.deleteDocument(documentId);

            // If the deleted document was selected, select another one
            if (selectedDocumentId === documentId) {
                const projectDocs = ProjectService.getDocumentsByProjectId(
                    docToDelete.getProjectId()
                );
                if (projectDocs.length > 0) {
                    setSelectedDocumentId(projectDocs[0].id);
                } else {
                    setSelectedDocumentId(null);
                }
            }
        },
        [selectedDocumentId]
    );

    const renameDocument = useCallback(
        (documentId: string, newName: string) => {
            const document = DocumentService.getDocumentById(documentId);
            if (!document) return;

            document.setTitle(newName);
            DocumentService.saveDocument(document);
        },
        []
    );

    const selectDocument = useCallback((documentId: string) => {
        setSelectedDocumentId(documentId);
    }, []);

    return {
        projects,
        selectedProjectId,
        selectedDocumentId,
        currentProjectDocuments,
        createProject,
        deleteProject,
        renameProject,
        selectProject,
        getDocumentsForProject,
        createDocument,
        deleteDocument,
        renameDocument,
        selectDocument,
    };
}
