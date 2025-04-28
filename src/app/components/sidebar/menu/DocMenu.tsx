import { File } from "lucide-react";
import DropDownMenu from "./DropDownMenu";
import {
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useProjectContext } from "@/app/viewModels/context/ProjectContext";
import { useDeleteDocumentMutation } from "@/app/viewModels/hooks/useDeleteDocumentMutation";

const dropdownItems = ["Edit", "Delete"];

interface DocMenuProps {
    projectId: string;
    documentId: string;
    title: string;
}

const DocMenu = ({ projectId, documentId, title }: DocMenuProps) => {
    const { mutateAsync: deleteDocumentMutation } = useDeleteDocumentMutation();
    const { selectedDocumentId, selectDocument, openDocumentDialog } =
        useProjectContext();

    const isSelected = selectedDocumentId === documentId;

    const handleMenuClick = (action: string, e: React.MouseEvent) => {
        e.stopPropagation();

        console.log(action);
        if (action === "Delete") {
            deleteDocumentMutation(documentId);
        } else if (action === "Edit") {
            openDocumentDialog(projectId, documentId);
        }
    };

    return (
        <SidebarMenuSubItem>
            <SidebarMenuSubButton
                asChild
                className={`hover:bg-neutral-200 ${
                    isSelected ? "bg-neutral-200" : ""
                }`}
                onClick={() => selectDocument(documentId)}
            >
                <div>
                    <File />
                    <span className="truncate select-none">{title}</span>
                    <div className="ml-auto flex items-center gap-1">
                        <DropDownMenu
                            dropdownItems={dropdownItems}
                            onClick={handleMenuClick}
                        />
                    </div>
                </div>
            </SidebarMenuSubButton>
        </SidebarMenuSubItem>
    );
};

export default DocMenu;
