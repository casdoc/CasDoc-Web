import { TextField } from "@radix-ui/themes";
import { PiMagnifyingGlass } from "react-icons/pi";

export const AttachedSearchBar = () => {
    return (
        <TextField.Root
            size="2"
            placeholder="Search the docs…"
            className="rounded-md p-1"
        >
            <TextField.Slot>
                <PiMagnifyingGlass size={25} className="p-1" />
            </TextField.Slot>
        </TextField.Root>
    );
};
