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
            <SidebarMenuSubButton asChild className="hover:bg-neutral-200">
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
