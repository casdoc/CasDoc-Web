import DocMenu from "./DocMenu";
import DropDownMenu from "./DropDownMenu";
import { useState } from "react";
import { Folder, Plus } from "lucide-react";
import {
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuAction,
    SidebarMenuSub,
} from "@/components/ui/sidebar";

const dropdownItems = ["Rename", "Delete"];

interface ProjectMenuProps {
    name: string;
    onDelete?: (name: string) => void;
}

const ProjectMenu = ({ name, onDelete }: ProjectMenuProps) => {
    const [documents, setDocuments] = useState<string[]>([]);
    const [documentCount, setDocumentCount] = useState(1);

    const handleAddDocument = () => {
        const newDocument = `Document ${documentCount}`;
        setDocumentCount(documentCount + 1);
        setDocuments([...documents, newDocument]);
    };

    const handleDeleteDocument = (docName: string) => {
        setDocuments(documents.filter((doc) => doc !== docName));
    };

    const handleMenuClick = (action: string) => {
        if (action === "Delete" && onDelete) {
            // Handle delete action
            onDelete(name);
        } else if (action === "Rename") {
            // Handle rename action
        }
    };

    return (
        <SidebarMenuItem key={name}>
            <SidebarMenuButton asChild className="hover:bg-neutral-200">
                <div>
                    <Folder />
                    <span>{name}</span>
                    <SidebarMenuAction>
                        <div className="flex flex-row items-center gap-2 mr-7">
                            <Plus onClick={handleAddDocument} size={16} />
                            <DropDownMenu
                                dropdownItems={dropdownItems}
                                onClick={handleMenuClick}
                            />
                        </div>
                    </SidebarMenuAction>
                </div>
            </SidebarMenuButton>

            <SidebarMenuSub>
                {documents.map((doc) => (
                    <DocMenu
                        key={doc}
                        name={doc}
                        onDelete={handleDeleteDocument}
                    />
                ))}
            </SidebarMenuSub>
        </SidebarMenuItem>
    );
};

export default ProjectMenu;
