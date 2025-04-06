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

const ProjectEditDialog = () => {
    const {
        editingProject: project,
        editProject,
        closeEditProjectDialog,
    } = useProjectContext();
    const handleEditProject = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(project);
        if (!project) return;

        const formData = new FormData(e.currentTarget);

        const name =
            formData.get("name")?.toString()?.trim() ?? "Untitled Project";
        const description =
            formData.get("description")?.toString().trim() ?? "";

        const updatedProject: ProjectInput = {
            name,
            description,
        };
        console.log("Updated Project:", updatedProject);
        editProject(project.id, updatedProject);
        closeEditProjectDialog();
    };

    return (
        <Dialog open={project !== null} onOpenChange={closeEditProjectDialog}>
            <DialogContent>
                <form onSubmit={handleEditProject}>
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

export default ProjectEditDialog;
