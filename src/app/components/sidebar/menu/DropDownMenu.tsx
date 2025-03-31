import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

interface DropDownMenuProps {
    dropdownItems: string[];
    onClick?: (item: string) => void;
}

const DropDownMenu = ({ dropdownItems, onClick }: DropDownMenuProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <MoreHorizontal className="ml-auto" />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start">
                {dropdownItems.map((item) => (
                    <DropdownMenuItem
                        key={item}
                        onClick={() => onClick?.(item)}
                    >
                        <span>{item}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default DropDownMenu;
