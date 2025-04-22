import { TextField } from "@radix-ui/themes";
import { PiMagnifyingGlass } from "react-icons/pi";

const SearchBar = ({
    searchContent,
    setSearchContent,
}: {
    searchContent: string;
    setSearchContent: (content: string) => void;
}) => {
    return (
        <TextField.Root
            size="2"
            placeholder="Search the docs…"
            className="rounded-md p-1"
            value={searchContent}
            onChange={(e) => setSearchContent(e.target.value)}
        >
            <TextField.Slot>
                <PiMagnifyingGlass size={25} className="p-1" />
            </TextField.Slot>
        </TextField.Root>
    );
};

export default SearchBar;
