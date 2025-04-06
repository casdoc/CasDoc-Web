import { File } from "lucide-react";
import DropDownMenu from "./DropDownMenu";
import {
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useProjectContext } from "@/app/viewModels/context/ProjectContext";

const dropdownItems = ["Edit", "Delete"];

interface DocMenuProps {
    projectId: string;
    documentId: string;
    title: string;
    onDelete: (documentId: string) => void;
}

const DocMenu = ({ documentId, title, onDelete }: DocMenuProps) => {
    const { selectedDocumentId, selectDocument, openEditDocumentDialog } =
        useProjectContext();

    const isSelected = selectedDocumentId === documentId;

    const handleMenuClick = (action: string, e: React.MouseEvent) => {
        e.stopPropagation();

        console.log(action);
        if (action === "Delete") {
            onDelete(documentId);
        } else if (action === "Edit") {
            openEditDocumentDialog(documentId);
        }
    };

    return (
        <SidebarMenuSubItem>
            <SidebarMenuSubButton
                asChild
                className={`hover:bg-gray-200 ${
                    isSelected ? "bg-gray-200" : ""
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
