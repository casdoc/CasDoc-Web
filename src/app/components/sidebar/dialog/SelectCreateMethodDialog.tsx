import { Button } from "@/components/ui/button";
import {
    DialogDescription,
    DialogTitle,
    DialogHeader,
} from "@/components/ui/dialog";

export const SelectCreateMethodDialog = ({
    onSelect,
}: {
    onSelect: (mode: "blank" | "draft") => void;
}) => (
    <div className="flex flex-col items-start gap-6">
        <DialogHeader>
            <DialogTitle>New Project</DialogTitle>
            <DialogDescription>
                Choose how you want to start your project.
            </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col w-full gap-4">
            <Button className="w-full" onClick={() => onSelect("blank")}>
                Create Blank Project
            </Button>
            <Button
                className="w-full"
                variant="outline"
                onClick={() => onSelect("draft")}
            >
                Draft with AI
            </Button>
        </div>
    </div>
);
