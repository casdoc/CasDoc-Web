import { DialogContent, Dialog } from "@/components/ui/dialog";
import { useProjectContext } from "@/app/viewModels/context/ProjectContext";
import { ProjectInput } from "@/app/models/types/ProjectInput";
import { useState } from "react";
import { DraftProjectWithAIForm } from "./DraftProjectWithAIForm";
import { CreateBlankProjectForm } from "./CreateBlankProjectForm";
import { SelectCreateMethodDialog } from "./SelectCreateMethodDialog";

const ProjectDialog = () => {
    const [mode, setMode] = useState<"blank" | "draft" | null>(null);
    const [prompt, setPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isDraftReady, setIsDraftReady] = useState(false);
    const {
        editingProject: project,
        isProjectDialogOpen,
        createProject,
        editProject,
        closeProjectDialog,
        createProjectWithAI
    } = useProjectContext();
    const handleSaveProject = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const name =
            formData.get("name")?.toString()?.trim() ?? "Untitled Project";
        const description =
            formData.get("description")?.toString().trim() ?? "";

        const input: ProjectInput = {
            name,
            description,
        };

        if (!project) {
            // Create project
            createProject(input);
        } else {
            // Update project
            editProject(project.id, input);
        }
        closeProjectDialog();
    };
    const handleDraftWithAI = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isGenerating) return;

        setIsGenerating(true);
        console.log("Prompt for AI Drafting:", prompt);

        setPrompt("");

        setTimeout(() => {
            setIsGenerating(false);
            setIsDraftReady(true);
        }, 2000);
    };

    const handleApplyDraft = () => {
        createProjectWithAI();
        closeProjectDialog();
        setMode(null);
        setIsDraftReady(false);
        setPrompt("");
    };
    return (
        <Dialog
            open={isProjectDialogOpen}
            onOpenChange={(open) => {
                if (!open) {
                    setMode(null);
                    setIsGenerating(false);
                    setIsDraftReady(false);
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
                    <CreateBlankProjectForm
                        project={project}
                        onSubmit={handleSaveProject}
                        onBack={() => setMode(null)}
                    />
                )}
                {mode === "draft" && (
                    <DraftProjectWithAIForm
                        prompt={prompt}
                        setPrompt={setPrompt}
                        onSubmit={handleDraftWithAI}
                        isGenerating={isGenerating}
                        onBack={() => setMode(null)}
                        onApply={handleApplyDraft}
                        isDraftReady={isDraftReady}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ProjectDialog;
