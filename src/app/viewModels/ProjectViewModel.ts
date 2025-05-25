import { useState, useEffect, useCallback, useMemo } from "react";
import { Project } from "@/app/models/entity/Project";
import { Document } from "@/app/models/types/Document";
import { useProjectsQuery } from "./hooks/useProjectsQuery";
import { usePathname } from "next/navigation";
import { useDocumentsQueriesByProjects } from "./hooks/useDocumentsQueriesByProjects";

export interface ProjectViewModel {
    isInitialized: boolean;

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
    const pathname = usePathname();

    const { data: projects, isSuccess: isProjectsSuccess } = useProjectsQuery();

    const { data: documentsMap, isSuccess: isDocumentsSuccess } =
        useDocumentsQueriesByProjects(projects);

    const [isInitialized, setIsInitialized] = useState(false);
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

    // Mapping documentId to projectId
    const documentIdToProjectIdMap = useMemo(() => {
        const map: Record<string, string> = {};
        for (const documents of Object.values(documentsMap)) {
            for (const doc of documents) {
                map[doc.id] = doc.projectId;
            }
        }
        return map;
    }, [documentsMap]);

    // Watch for URL changes to extract documentId from /document/{documentId} pattern
    useEffect(() => {
        const documentMatch = pathname.match(/^\/document\/([^\/]+)$/);
        if (documentMatch) {
            const urlDocumentId = documentMatch[1];
            if (urlDocumentId !== selectedDocumentId) {
                setSelectedDocumentId(urlDocumentId);
            }
        }
    }, [pathname, selectedDocumentId]);

    // Initial selected project and document
    useEffect(() => {
        if (isProjectsSuccess && isDocumentsSuccess) {
            setIsInitialized(true);
        }

        // Select first document and project for default
        if (isDocumentsSuccess && documentsMap) {
            for (const [projId, docs] of Object.entries(documentsMap)) {
                if (docs.length > 0) {
                    const firstDoc = docs[0];
                    setSelectedProjectId(projId);
                    setSelectedDocumentId(firstDoc.id);
                    return;
                }
            }
        }

        // If don't have document, select first project
        if (isProjectsSuccess && projects && projects.length > 0) {
            setSelectedProjectId(projects[0].id);
        }
    }, [projects, documentsMap, isProjectsSuccess, isDocumentsSuccess]);

    const selectProject = useCallback(
        (projectId: string) => {
            console.debug("Select project: ", projectId);
            if (projectId === selectedProjectId) return;
            setSelectedProjectId(projectId);
        },
        [selectedProjectId]
    );

    const selectDocument = useCallback(
        (documentId: string) => {
            console.debug("Select document: ", documentId);
            if (documentId === selectedDocumentId) return;
            setSelectedProjectId(documentIdToProjectIdMap[documentId]);
            setSelectedDocumentId(documentId);
        },
        [selectedDocumentId, documentIdToProjectIdMap]
    );

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
                documentsMap[projectId]?.find(
                    (document) => document.id === documentId
                ) || null
            );
        },
        [projects, documentsMap]
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
        isInitialized,
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
