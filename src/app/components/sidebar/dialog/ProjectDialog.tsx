import { DialogContent, Dialog } from "@/components/ui/dialog";
import { useProjectContext } from "@/app/viewModels/context/ProjectContext";
import { useCreateProjectMutation } from "@/app/viewModels/hooks/useCreateProjectMutation";
import { useUpdateProjectMutation } from "@/app/viewModels/hooks/useUpdateProjectMutation";
import { useState, useRef } from "react";
import { ProjectAIForm } from "./ProjectAIForm";
import { ProjectForm } from "./ProjectForm";
import { SelectCreateMethodDialog } from "./SelectCreateMethodDialog";

const ProjectDialog = () => {
    const { mutateAsync: createProjectMutation } = useCreateProjectMutation();
    const { mutateAsync: updateProjectMutation } = useUpdateProjectMutation();
    const {
        editingProject: project,
        isProjectDialogOpen,
        closeProjectDialog,
    } = useProjectContext();

    const [mode, setMode] = useState<"blank" | "draft" | null>(null);
    const [prompt, setPrompt] = useState(
        `I want create a system that is menu system, which can be used to manage the menu of a restaurant. 
        The system should allow users to add, edit, and delete menu items. 
        It should also allow users to view the menu items in a list format. 
        And the system has a user management system, which can be used to manage the users of the system;`
    );
    const abortControllerRef = useRef<AbortController | null>(null);

    const handleSaveProject = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const name =
            formData.get("name")?.toString()?.trim() ?? "Untitled Project";
        const description =
            formData.get("description")?.toString()?.trim() ?? "";

        if (!project) {
            createProjectMutation({ name, description });
        } else {
            updateProjectMutation({
                projectId: project.id,
                projectInput: { name, description },
            });
        }
        closeProjectDialog();
        setMode(null);
    };

    return (
        <Dialog
            open={isProjectDialogOpen}
            onOpenChange={(open) => {
                if (!open) {
                    // Cancel any ongoing generation
                    if (abortControllerRef.current) {
                        abortControllerRef.current.abort();
                    }
                    setMode(null);
                    setPrompt("");
                }
                closeProjectDialog();
            }}
        >
            <DialogContent
                style={{ minWidth: mode === "draft" ? "1000px" : "300px" }}
            >
                {!mode && <SelectCreateMethodDialog onSelect={setMode} />}
                {mode === "blank" && (
                    <ProjectForm
                        project={project}
                        onSubmit={handleSaveProject}
                        onBack={() => setMode(null)}
                    />
                )}
                {mode === "draft" && (
                    <ProjectAIForm
                        prompt={prompt}
                        setPrompt={setPrompt}
                        onBack={() => setMode(null)}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ProjectDialog;
