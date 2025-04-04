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
import { DocumentUpdate } from "@/app/models/types/DocumentUpdate";
import { DocumentType } from "@/app/models/enum/DocumentType";
import { useProjectContext } from "@/app/viewModels/context/ProjectContext";

const DocEditDialog = () => {
    const {
        editingDocument: doc,
        editDocument,
        closeEditDocumentDialog,
    } = useProjectContext();
    const [type, setType] = useState<DocumentType>(
        doc?.getType() ?? DocumentType.SRD
    );
    const handleEditDocument = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(doc);
        if (!doc) return;

        const formData = new FormData(e.currentTarget);

        const title =
            formData.get("title")?.toString()?.trim() ?? "Untitled Document";
        const description =
            formData.get("description")?.toString().trim() ?? "";

        const updatedDocument: DocumentUpdate = {
            title,
            description,
            type,
        };
        console.log("Updated Document:", updatedDocument);
        editDocument(doc.getId(), updatedDocument);
        closeEditDocumentDialog();
    };

    return (
        <Dialog open={doc !== null} onOpenChange={closeEditDocumentDialog}>
            <DialogContent>
                <form onSubmit={handleEditDocument}>
                    <DialogHeader>
                        <DialogTitle>Edit Document</DialogTitle>
                        <DialogDescription>
                            Edit the document details.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">
                                Title
                            </Label>
                            <Input
                                name="title"
                                defaultValue={
                                    doc?.getTitle() ?? "Untitled Document"
                                }
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
                                defaultValue={doc?.getDescription() ?? ""}
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
                                    <SelectItem value="SRD">SRD</SelectItem>
                                    <SelectItem value="SDD">SDD</SelectItem>
                                    <SelectItem value="STD">STD</SelectItem>
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

export default DocEditDialog;
