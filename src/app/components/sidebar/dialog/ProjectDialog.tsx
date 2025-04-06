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
import { ProjectInput } from "@/app/models/types/ProjectInput";

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

    return (
        <Dialog open={isProjectDialogOpen} onOpenChange={closeProjectDialog}>
            <DialogContent>
                <form onSubmit={handleSaveProject}>
                    <DialogHeader>
                        <DialogTitle>Edit Document</DialogTitle>
                        <DialogDescription>
                            Edit the document details.
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
                                placeholder="Enter project title"
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
