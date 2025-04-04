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

    // Project actions
    createProject: (name: string) => void;
    deleteProject: (projectId: string) => void;
    renameProject: (projectId: string, newName: string) => void;
    selectProject: (projectId: string) => void;

    // Document actions
    getDocumentsByProjectId: (projectId: string) => Document[];
    createDocument: (projectId: string, name: string) => void;
    deleteDocument: (documentId: string) => void;
    editDocument: (document: Document) => void;
    selectDocument: (documentId: string) => void;
}

export const useProjectViewModel = (): ProjectViewModel => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
        null
    );
    const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
        null
    );

    useEffect(() => {
        console.log("document", selectedDocumentId);
    }, [selectedDocumentId]);

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

    const editDocument = useCallback((newDocument: Document) => {
        DocumentService.saveDocument(newDocument);
    }, []);

    const selectDocument = useCallback((documentId: string) => {
        setSelectedDocumentId(documentId);
    }, []);

    return {
        projects,
        selectedProjectId,
        selectedDocumentId,
        createProject,
        deleteProject,
        renameProject,
        selectProject,
        getDocumentsByProjectId,
        createDocument,
        deleteDocument,
        editDocument,
        selectDocument,
    };
};
