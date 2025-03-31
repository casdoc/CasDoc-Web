import { File } from "lucide-react";
import DropDownMenu from "./DropDownMenu";
import {
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";

const dropdownItems = ["Rename", "Delete"];

interface DocMenuProps {
    name: string;
    onDelete?: (name: string) => void;
}

const DocMenu = ({ name, onDelete }: DocMenuProps) => {
    const handleMenuClick = (action: string) => {
        if (action === "Delete" && onDelete) {
            // Handle delete action
            onDelete(name);
        } else if (action === "Rename") {
            // Handle rename action
        }
    };

    return (
        <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild className="hover:bg-gray-200">
                <a href="#">
                    <File />
                    <span>{name}</span>
                    <DropDownMenu
                        dropdownItems={dropdownItems}
                        onClick={handleMenuClick}
                    />
                </a>
            </SidebarMenuSubButton>
        </SidebarMenuSubItem>
    );
};

export default DocMenu;
