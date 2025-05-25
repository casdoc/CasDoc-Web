import { useState, useEffect, useCallback, useMemo } from "react";
import { Project } from "@/app/models/entity/Project";
import { Document } from "@/app/models/types/Document";
import { useProjectsQuery } from "./hooks/useProjectsQuery";
import { usePathname, useRouter } from "next/navigation";
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
    selectProject: (projectId: string | null) => void;

    // Document actions
    selectDocument: (documentId: string | null) => void;

    // Dialog actions
    openProjectDialog: (projectId?: string) => void;
    openDocumentDialog: (projectId: string, documentId?: string) => void;
    closeProjectDialog: () => void;
    closeDocumentDialog: () => void;
}

export const useProjectViewModel = (): ProjectViewModel => {
    const pathname = usePathname();
    const router = useRouter();

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

    // Watch for URL changes to extract documentId from /documents/{documentId} pattern
    useEffect(() => {
        if (!isInitialized) return;

        const documentMatch = pathname.match(/^\/documents\/(\d+)$/);
        console.debug("document path: ", documentMatch);
        if (documentMatch) {
            const urlDocumentId = documentMatch[1];
            console.debug(urlDocumentId);
            if (
                urlDocumentId !== selectedDocumentId &&
                urlDocumentId in documentIdToProjectIdMap
            ) {
                setSelectedProjectId(documentIdToProjectIdMap[urlDocumentId]);
                setSelectedDocumentId(urlDocumentId);
            }
        }
    }, [pathname, selectedDocumentId, documentIdToProjectIdMap, isInitialized]);

    useEffect(() => {
        // Initialize one time
        if (isInitialized) return;

        if (isProjectsSuccess && isDocumentsSuccess) {
            setIsInitialized(true);
        }
    }, [isInitialized, isProjectsSuccess, isDocumentsSuccess]);

    const selectProject = useCallback(
        (projectId: string | null) => {
            console.debug("Select project: ", projectId);
            if (projectId === selectedProjectId) return;
            setSelectedProjectId(projectId);
            if (projectId === null) {
                setSelectedDocumentId(null);
                router.push(`/documents/overview`);
            }
        },
        [selectedProjectId, router]
    );

    const selectDocument = useCallback(
        (documentId: string | null) => {
            console.debug("Select document: ", documentId);
            if (documentId === selectedDocumentId) return;
            setSelectedDocumentId(documentId);

            if (documentId != null) {
                setSelectedProjectId(documentIdToProjectIdMap[documentId]);
                router.push(`/documents/${documentId}`);
            } else {
                router.push(`/documents/overview`);
            }
        },
        [selectedDocumentId, documentIdToProjectIdMap, router]
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
