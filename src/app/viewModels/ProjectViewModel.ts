import { useState, useEffect, useCallback, useMemo } from "react";
import { Project } from "@/app/models/entity/Project";
import { Document } from "@/app/models/entity/Document";
import { ProjectService } from "@/app/models/services/ProjectService";
import { DocumentService } from "@/app/models/services/DocumentService";
import { DocumentType } from "@/app/models/enum/DocumentType";
import defaultContent from "../models/default-value/defaultContent";
import { ProjectInput } from "../models/types/ProjectInput";
import { DocumentInput } from "../models/types/DocumentInput";
import { DocSelectedService } from "../models/services/DocSelectedService";
import { useProjectsQuery } from "./hooks/useProjectsQuery";
import { ProjectApiRequest } from "../models/dto/ProjectApiRequest";
import { useCreateProjectMutation } from "./hooks/useCreateProjectMutation";
export interface ProjectViewModel {
    projects: Project[] | [];
    documentsMap: Record<string, Document[]>;
    selectedProjectId: string | null;
    selectedDocumentId: string | null;
    isProjectDialogOpen: boolean;
    isDocumentDialogOpen: boolean;
    editingProject: Project | null;
    editingDocument: Document | null;

    // Project actions
    createProject: (input: ProjectInput) => void;
    deleteProject: (projectId: string) => void;
    editProject: (projectId: string, update: ProjectInput) => void;
    selectProject: (projectId: string) => void;
    getProjectByDocumentId: (documentId: string) => Project | undefined;

    // Document actions
    getDocumentsByProjectId: (projectId: string) => Document[];
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
    const { data: projectsData, isLoading: isLoadingProjects } =
        useProjectsQuery();
    const { mutateAsync: createProjectMutation } = useCreateProjectMutation();
    const [documentsMap, setDocumentsMap] = useState<
        Record<string, Document[]>
    >({});
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
    const projects: Project[] = useMemo(
        () => projectsData || [],
        [projectsData]
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
            const initialDocumentsMap: Record<string, Document[]> = {};
            projects.forEach((proj) => {
                initialDocumentsMap[proj.id] =
                    ProjectService.getDocumentsByProjectId(proj.id);
            });
            setDocumentsMap(initialDocumentsMap);
        }
    }, [isLoadingProjects, projects]);

    const createProject = useCallback(
        (input: ProjectApiRequest): void => {
            try {
                // Use the mutation to handle optimistic updates and rollbacks
                createProjectMutation(input);
            } catch (error) {
                console.error("Failed to create project:", error);
                throw new Error("Failed to create project");
            }
        },
        [createProjectMutation]
    );

    const deleteProject = useCallback(
        (projectId: string) => {
            if (selectedProjectId === projectId) setSelectedProjectId(null);
            ProjectService.deleteProject(projectId);

            // Update local state
            // setProjects((prevProjects) =>
            // prevProjects.filter((proj) => proj.id !== projectId)
            // );
        },
        [selectedProjectId]
    );

    const editProject = useCallback(
        (projectId: string, update: ProjectInput) => {
            ProjectService.updateProject(projectId, update);
            // setProjects((prevProjects) =>
            //     prevProjects.map((proj) =>
            //         proj.id === projectId
            //             ? ({ ...proj, ...update } as Project)
            //             : proj
            //     )
            // );
        },
        []
    );

    const selectProject = useCallback((projectId: string) => {
        setSelectedProjectId(projectId);
    }, []);

    const getProjectByDocumentId = (
        documentId: string
    ): Project | undefined => {
        for (const project of projects) {
            const documents = getDocumentsByProjectId(project.id);
            const doc = documents.find((d) => d.id === documentId);
            if (doc) return project;
        }
    };

    // Document Actions
    const getDocumentsByProjectId = useCallback(
        (projectId: string): Document[] => {
            return ProjectService.getDocumentsByProjectId(projectId);
        },
        []
    );

    useEffect(() => {
        const localSelectedDoc = DocSelectedService.getSelectedDoc();
        if (localSelectedDoc === "") {
            if (projects && projects[0]) {
                const docs = getDocumentsByProjectId(projects[0].id);
                if (docs.length > 0 && docs[0]) {
                    setSelectedDocumentId(docs[0].id);
                    return;
                }
            }
        }
        if (selectedDocumentId !== localSelectedDoc) {
            setSelectedDocumentId(localSelectedDoc);
        }
    }, [projects, getDocumentsByProjectId, selectedDocumentId]);

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
            const documents = getDocumentsByProjectId(project.id);
            const doc = documents.find((d) => d.id === documentId);
            if (doc) return doc;
        }
        return undefined;
    };

    return {
        projects,
        documentsMap,
        selectedProjectId,
        selectedDocumentId,
        isProjectDialogOpen,
        isDocumentDialogOpen,
        editingProject,
        editingDocument,
        createProject,
        deleteProject,
        editProject,
        selectProject,
        getProjectByDocumentId,
        getDocumentsByProjectId,
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
