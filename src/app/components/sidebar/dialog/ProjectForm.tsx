import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    DialogDescription,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Project } from "@/app/models/entity/Project";
import { Flex, Grid } from "@radix-ui/themes";
import { ArrowLeft } from "lucide-react";

export const ProjectForm = ({
    project,
    onSubmit,
    onBack,
}: {
    project: Project | null;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onBack: () => void;
}) => (
    <form onSubmit={onSubmit}>
        <Flex align="center" className="gap-2 mb-4">
            <Button variant="ghost" size="icon" onClick={onBack} type="button">
                <ArrowLeft className="h-4 w-4" />
            </Button>
            <DialogTitle className="text-lg">
                {!project ? "Create Project" : "Edit Project"}
            </DialogTitle>
        </Flex>

        <DialogDescription className="mb-6">
            {!project
                ? "Fill in the details to create a new project."
                : "Edit the project details."}
        </DialogDescription>

        <Grid className="gap-4 py-4">
            <Grid columns="4" align="center" className="gap-4">
                <Label htmlFor="name" className="text-right">
                    Name
                </Label>
                <Input
                    name="name"
                    defaultValue={project?.name ?? "Untitled Project"}
                    placeholder="Enter project name"
                    className="col-span-3"
                />
            </Grid>
            <Grid columns="4" align="center" className="gap-4">
                <Label htmlFor="description" className="text-right">
                    Description
                </Label>
                <Input
                    name="description"
                    defaultValue={project?.description ?? ""}
                    placeholder="Enter project description"
                    className="col-span-3"
                />
            </Grid>
        </Grid>

        <DialogFooter>
            <Button type="submit">Save changes</Button>
        </DialogFooter>
    </form>
);
