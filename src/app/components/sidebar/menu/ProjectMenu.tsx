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

interface ProjectMenuProps {
    name: string;
}

const ProjectMenu = ({ name }: ProjectMenuProps) => {
    const [documents, setDocuments] = useState<string[]>([]);

    const handleAddDocument = () => {
        const newDocument = `Document ${documents.length + 1}`;
        setDocuments([...documents, newDocument]);
    };

    return (
        <SidebarMenuItem key={name}>
            <SidebarMenuButton asChild>
                <a href="#">
                    <Folder />
                    <span>{name}</span>
                </a>
            </SidebarMenuButton>
            <SidebarMenuAction>
                <DropDownMenu dropdownItems={["Rename", "Delete"]} />
                <Plus onClick={handleAddDocument} />
            </SidebarMenuAction>

            <SidebarMenuSub>
                {documents.map((doc) => (
                    <DocMenu key={doc} name={doc} />
                ))}
            </SidebarMenuSub>
        </SidebarMenuItem>
    );
};

export default ProjectMenu;
