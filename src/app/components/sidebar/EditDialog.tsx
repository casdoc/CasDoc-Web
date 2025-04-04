import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogHeader,
    DialogFooter,
} from "@/components/ui/dialog";
import { Document } from "@/app/models/entity/Document";

const EditDialog = (document?: Document) => {
    const documentContent = {
        title: "Edit Document",
        description: "Edit the document details.",
        editContent: [
            {
                id: "title",
                label: "Title",
                value: document ? document.getTitle : "Untitled Document",
                placeholder: "Enter document title",
            },
            {
                id: "description",
                label: "Description",
                value: document ? document.getDescription : "",
                placeholder: "Enter document description",
            },
            {
                id: "documentType",
                label: "Document Type",
                value: document ? document.getType : "SDD",
                placeholder: "Select document type",
            },
        ],
    };

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{documentContent.title}</DialogTitle>
                <DialogDescription>
                    {documentContent.description}
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                {documentContent.editContent.map((content) => (
                    <div
                        className="grid grid-cols-4 items-center gap-4"
                        key={content.id}
                    >
                        <Label htmlFor={content.id} className="text-right">
                            {content.label}
                        </Label>
                        <Input
                            id={content.id}
                            // value={content.value}
                            placeholder={content.placeholder}
                            className="col-span-3"
                        />
                    </div>
                ))}
            </div>
            <DialogFooter>
                <Button type="submit">Save changes</Button>
            </DialogFooter>
        </DialogContent>
    );
};

export default EditDialog;
