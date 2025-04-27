import { IoExtensionPuzzleOutline } from "react-icons/io5";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Flex } from "@radix-ui/themes";
import { GraphAttachList } from "./GraphAttachList";
import { useEffect, useState } from "react";
import { useGraphContext } from "@/app/viewModels/context/GraphContext";
import { useProjectContext } from "@/app/viewModels/context/ProjectContext";
import SearchBar from "@/app/components/SearchBar";
import { useProjectsQuery } from "@/app/viewModels/hooks/useProjectsQuery";

export const GraphAttachDialog = ({
    openAttach,
    setOpenAttach,
}: {
    openAttach: boolean;
    setOpenAttach: (open: boolean) => void;
}) => {
    const { data: projects } = useProjectsQuery();
    const { selectedDocumentId } = useProjectContext();
    const [isSelected, setIsSelected] = useState<Record<string, boolean>>({});
    const [searchContent, setSearchContent] = useState("");
    const { setAttachedDocs } = useGraphContext();

    useEffect(() => {
        setIsSelected((prev) => {
            const updated: Record<string, boolean> = {};
            projects?.forEach((project) => {
                updated[project.id] = prev[project.id] ?? false;
            });
            return updated;
        });
    }, [projects]);

    useEffect(() => {
        setIsSelected({});
        setAttachedDocs([]);
    }, [selectedDocumentId, setAttachedDocs]);

    const toggleSelected = (id: string) => {
        setIsSelected((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <Dialog open={openAttach} onOpenChange={setOpenAttach}>
            <DialogTrigger asChild>
                <button
                    className="hover:bg-gray-200 transition-colors duration-300 p-1.5 rounded-lg select-none"
                    onClick={() => setOpenAttach(true)}
                >
                    <IoExtensionPuzzleOutline size={28} />
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        <Flex align="center" className="gap-x-1.5">
                            <IoExtensionPuzzleOutline size={24} />
                            Attach more docs
                        </Flex>
                    </DialogTitle>
                    <DialogDescription>
                        Search and select some documents to attach to the graph.
                    </DialogDescription>
                </DialogHeader>
                <SearchBar
                    searchContent={searchContent}
                    setSearchContent={setSearchContent}
                />
                <GraphAttachList
                    isSelected={isSelected}
                    toggleSelected={toggleSelected}
                    searchContent={searchContent}
                />
            </DialogContent>
        </Dialog>
    );
};
