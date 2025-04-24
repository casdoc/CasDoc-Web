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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { useState } from "react";
import { DocumentInput } from "@/app/models/types/DocumentInput";
import { DocumentType } from "@/app/models/enum/DocumentType";
import { useProjectContext } from "@/app/viewModels/context/ProjectContext";
import { useCreateDocumentMutation } from "@/app/viewModels/hooks/useCreateDocumentMutation";

const DocDialog = () => {
    const {
        editingProject: project,
        editingDocument: doc,
        isDocumentDialogOpen,
        editDocument,
        closeDocumentDialog,
    } = useProjectContext();

    const { mutateAsync: createDocumentMutation } = useCreateDocumentMutation();
    const [type, setType] = useState<DocumentType>(
        doc?.type ?? DocumentType.SRD
    );
    const handleEditDocument = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!project) return;

        const formData = new FormData(e.currentTarget);
        const title =
            formData.get("title")?.toString()?.trim() ?? "Untitled Document";
        const description =
            formData.get("description")?.toString().trim() ?? "";

        const input: DocumentInput = {
            title,
            description,
            type,
            projectId: project.id,
        };

        if (!doc) {
            createDocumentMutation({
                title,
                description,
                type,
                projectId: project.id,
            });
        } else {
            // Edit document
            editDocument(doc.id, input);
        }
        closeDocumentDialog();
    };

    return (
        <Dialog open={isDocumentDialogOpen} onOpenChange={closeDocumentDialog}>
            <DialogContent>
                <form onSubmit={handleEditDocument}>
                    <DialogHeader>
                        <DialogTitle>
                            {!doc ? "Create Document" : "Edit Document"}
                        </DialogTitle>
                        <DialogDescription>
                            {!doc
                                ? "Fill in the details to create a new document."
                                : "Edit the document details."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">
                                Title
                            </Label>
                            <Input
                                name="title"
                                defaultValue={doc?.title ?? "Untitled Document"}
                                placeholder="Enter document title"
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <Input
                                name="description"
                                defaultValue={doc?.description ?? ""}
                                placeholder="Enter document description"
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                                htmlFor="documentType"
                                className="text-right"
                            >
                                DocumentType
                            </Label>
                            <Select
                                name="documentType"
                                defaultValue={type}
                                onValueChange={(value) =>
                                    setType(value as DocumentType)
                                }
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select document type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="SRD">
                                        Software Requirements Document ( SRD )
                                    </SelectItem>
                                    <SelectItem value="SDD">
                                        Software Design Document ( SDD )
                                    </SelectItem>
                                    <SelectItem value="STD">
                                        Software Test Document ( STD )
                                    </SelectItem>
                                    <SelectItem value="OTHER">OTHER</SelectItem>
                                </SelectContent>
                            </Select>
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

export default DocDialog;
