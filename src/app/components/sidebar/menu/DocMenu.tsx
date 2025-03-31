import { File } from "lucide-react";
import DropDownMenu from "./DropDownMenu";
import {
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useProjectContext } from "@/app/viewModels/context/ProjectContext";

const dropdownItems = ["Rename", "Delete"];

interface DocMenuProps {
    name: string;
    documentId: string;
}

const DocMenu = ({ name, documentId }: DocMenuProps) => {
    const {
        selectedDocumentId,
        deleteDocument,
        renameDocument,
        selectDocument,
    } = useProjectContext();

    const isSelected = selectedDocumentId === documentId;

    const handleMenuClick = (action: string) => {
        if (action === "Delete") {
            deleteDocument(documentId);
        } else if (action === "Rename") {
            const newName = prompt("Enter new document name:", name);
            if (newName && newName.trim() !== "") {
                renameDocument(documentId, newName);
            }
        }
    };

    const handleDocumentClick = () => {
        selectDocument(documentId);
    };

    return (
        <SidebarMenuSubItem>
            <SidebarMenuSubButton
                asChild
                className={`hover:bg-neutral-200 ${
                    isSelected ? "bg-gray-200" : ""
                }`}
                onClick={handleDocumentClick}
            >
                <div className="flex flex-row justify-between w-full">
                    <div className="flex flex-row items-center gap-2">
                        <File size={16} />
                        <span>{name}</span>
                    </div>
                    <DropDownMenu
                        dropdownItems={dropdownItems}
                        onClick={handleMenuClick}
                    />
                </div>
            </SidebarMenuSubButton>
        </SidebarMenuSubItem>
    );
};

export default DocMenu;
