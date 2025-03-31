import DocMenu from "./DocMenu";
import DropDownMenu from "./DropDownMenu";
import { useState } from "react";
import { ChevronDown, Folder, Plus } from "lucide-react";
import {
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuSub,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { CollapsibleTrigger } from "@radix-ui/react-collapsible";

const dropdownItems = ["Rename", "Delete"];

interface ProjectMenuProps {
    name: string;
    onDelete?: (name: string) => void;
}

const ProjectMenu = ({ name, onDelete }: ProjectMenuProps) => {
    const [documents, setDocuments] = useState<string[]>([]);
    const [documentCount, setDocumentCount] = useState(1);
    const [isOpen, setIsOpen] = useState(true);

    const handleAddDocument = (e: React.MouseEvent) => {
        e.stopPropagation();
        const newDocument = `Document ${documentCount}`;
        setDocumentCount(documentCount + 1);
        setDocuments([...documents, newDocument]);
        setIsOpen(true);
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
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <SidebarMenuItem key={name}>
                <CollapsibleTrigger asChild className="w-full group/chevron">
                    <SidebarMenuButton asChild className=" hover:bg-gray-200">
                        <a href="#">
                            <Folder />
                            <span className="flex items-center gap-1">
                                {name}
                                <ChevronDown className="w-4 h-4 opacity-0 group-hover/chevron:opacity-100 transition-all duration-200 group-data-[state=open]/chevron:rotate-180" />
                            </span>

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
                </CollapsibleTrigger>

                <CollapsibleContent>
                    <SidebarMenuSub>
                        {documents.map((doc) => (
                            <DocMenu
                                key={doc}
                                name={doc}
                                onDelete={handleDeleteDocument}
                            />
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    );
};

export default ProjectMenu;
