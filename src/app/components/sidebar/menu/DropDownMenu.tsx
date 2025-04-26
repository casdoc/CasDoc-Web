import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

interface DropDownMenuProps {
    dropdownItems: string[];
    onClick?: (item: string, e: React.MouseEvent) => void;
}

const DropDownMenu = ({ dropdownItems, onClick }: DropDownMenuProps) => {
    const handleItemClick = (item: string, e: React.MouseEvent) => {
        e.stopPropagation();
        onClick?.(item, e);
    };
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <MoreHorizontal className="hover:bg-neutral-300 rounded-md w-6 h-6 p-1" />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start">
                {dropdownItems.map((item) => (
                    <DropdownMenuItem
                        key={item}
                        onClick={(e) => handleItemClick(item, e)}
                    >
                        <span>{item}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default DropDownMenu;
