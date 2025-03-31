import DocMenu from "./DocMenu";
import DropDownMenu from "./DropDownMenu";
import { useState } from "react";
import { Folder, Plus } from "lucide-react";
import {
    SidebarMenuItem,
    SidebarMenuButton,
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
            <SidebarMenuButton asChild className="hover:bg-gray-200">
                <a href="#">
                    <Folder />
                    <span>{name}</span>
                    <div className="ml-auto flex items-center gap-1">
                        <Plus
                            onClick={handleAddDocument}
                            className="hover:bg-gray-300 rounded-md w-6 h-6 p-1"
                        />
                        <DropDownMenu
                            dropdownItems={dropdownItems}
                            onClick={handleMenuClick}
                        />
                    </div>
                </a>
            </SidebarMenuButton>
            {/* <SidebarMenuAction></SidebarMenuAction> */}

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
