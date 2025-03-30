import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

interface DropDownMenuProps {
    dropdownItems: string[];
}

const DropDownMenu = ({ dropdownItems }: DropDownMenuProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <MoreHorizontal className="ml-auto" />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="start">
                {dropdownItems.map((item) => (
                    <DropdownMenuItem key={item}>
                        <span>{item}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default DropDownMenu;
