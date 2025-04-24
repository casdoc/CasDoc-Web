import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogHeader,
    DialogFooter,
    Dialog,
} from "@/components/ui/dialog";
import { useProjectContext } from "@/app/viewModels/context/ProjectContext";

const ProjectDialog = () => {
    const {
        editingProject: project,
        isProjectDialogOpen,
        createProject,
        editProject,
        closeProjectDialog,
    } = useProjectContext();
    const handleSaveProject = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const name =
            formData.get("name")?.toString()?.trim() ?? "Untitled Project";
        const description =
            formData.get("description")?.toString().trim() ?? "";

        if (!project) {
            // Create project
            createProject({ name, description });
        } else {
            // Update project
            editProject(project.id, { name, description });
        }
        closeProjectDialog();
    };

    return (
        <Dialog open={isProjectDialogOpen} onOpenChange={closeProjectDialog}>
            <DialogContent>
                <form onSubmit={handleSaveProject}>
                    <DialogHeader>
                        <DialogTitle>
                            {!project ? "Create Project" : "Edit Project"}
                        </DialogTitle>
                        <DialogDescription>
                            {!project
                                ? "Fill in the details to create a new project."
                                : "Edit the project details."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                name
                            </Label>
                            <Input
                                name="name"
                                defaultValue={
                                    project?.name ?? "Untitled Project"
                                }
                                placeholder="Enter project name"
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <Input
                                name="description"
                                defaultValue={project?.description ?? ""}
                                placeholder="Enter project description"
                                className="col-span-3"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ProjectDialog;
