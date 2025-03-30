import { File } from "lucide-react";
import DropDownMenu from "./DropDownMenu";
import {
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";

interface DocMenuProps {
    name: string;
}

const DocMenu = ({ name }: DocMenuProps) => {
    return (
        <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild>
                <a href="#">
                    <File />
                    <span>{name}</span>
                    <DropDownMenu dropdownItems={["Rename", "Delete"]} />
                </a>
            </SidebarMenuSubButton>
        </SidebarMenuSubItem>
    );
};

export default DocMenu;
